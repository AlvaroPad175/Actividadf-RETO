"""
main.py — Liga MX Champions Data Pipeline

Usage:
    python -m data.pipeline.main --help
    python -m data.pipeline.main scrape              # Full scrape + export
    python -m data.pipeline.main export-seed         # Export seed data only (no scraping)
    python -m data.pipeline.main scrape --season apertura-2023
    python -m data.pipeline.main scrape --dry-run    # Show what would be scraped
"""
import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from rich.logging import RichHandler
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
from rich.table import Table

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    handlers=[RichHandler(rich_tracebacks=True)],
)
logger = logging.getLogger("pipeline")
console = Console()

# ── Project root resolution ───────────────────────────────────────────────────
_HERE = Path(__file__).resolve().parent
_REPO_ROOT = _HERE.parent.parent          # /home/user/Actividadf-RETO
_OUTPUT_DIR = _REPO_ROOT / "data" / "output"
_DB_PATH = _OUTPUT_DIR / "liga_mx.db"
_MANUAL_OVERRIDES = _HERE / "manual" / "lineups_override.json"


# ── Lazy imports from sibling modules ────────────────────────────────────────

def _import_pipeline():
    """Import all pipeline modules (deferred so --help works without deps)."""
    from .champions_seed import CHAMPIONS
    from .constants import TEAM_REGISTRY, FORMATION_SLOTS
    from .models import Tournament, Team, Player, LineupEntry
    from .scraper import Scraper, fetch_champions_history, fetch_team_squad
    from .parser import (
        parse_champions_history,
        parse_squad_page,
        assign_formation_order,
        build_lineup_from_squad,
        build_lineup_from_manual,
        make_player_id,
        normalize_name,
    )
    from .exporter import export_json, export_csv, export_sqlite
    return (
        CHAMPIONS, TEAM_REGISTRY, FORMATION_SLOTS,
        Tournament, Team, Player, LineupEntry,
        Scraper, fetch_champions_history, fetch_team_squad,
        parse_champions_history, parse_squad_page, assign_formation_order,
        build_lineup_from_squad, build_lineup_from_manual, make_player_id, normalize_name,
        export_json, export_csv, export_sqlite,
    )


# ── Data builders ─────────────────────────────────────────────────────────────

def build_teams_from_registry(TEAM_REGISTRY: Dict) -> List[Dict]:
    """Build team dicts from the constants registry."""
    teams = []
    for team_id, info in TEAM_REGISTRY.items():
        teams.append({
            "id":       team_id,
            "name":     info["name"],
            "tm_id":    info.get("tm_id"),
            "tm_slug":  info.get("slug"),
            "logo_url": None,
        })
    return teams


def build_tournaments_from_seed(CHAMPIONS: List[Dict]) -> List[Dict]:
    """Convert raw seed dicts to tournament dicts."""
    tournaments = []
    for c in CHAMPIONS:
        tournaments.append({
            "id":                 c["id"],
            "year":               c["year"],
            "season_type":        c["season_type"],
            "champion_team_id":   c["team_id"],
            "formation":          c.get("formation"),
            "runner_up_team_id":  c.get("runner_up_team_id"),
            "source":             "seed",
            "needs_verification": c.get("needs_verification", False),
        })
    return tournaments


def load_manual_overrides() -> Dict:
    """Load manual lineup overrides from JSON file. Returns empty dict on error."""
    if not _MANUAL_OVERRIDES.exists():
        logger.warning(f"Manual overrides file not found: {_MANUAL_OVERRIDES}")
        return {}
    try:
        with open(_MANUAL_OVERRIDES, "r", encoding="utf-8") as f:
            data = json.load(f)
        # Remove metadata keys starting with underscore
        return {k: v for k, v in data.items() if not k.startswith("_")}
    except Exception as e:
        logger.error(f"Failed to load manual overrides: {e}")
        return {}


def deduplicate_players(players_list: List[Dict]) -> List[Dict]:
    """
    Deduplicate players by TM ID (preferred) or by ID string.
    Later entries with the same key override earlier ones.
    """
    seen: Dict[str, Dict] = {}
    for p in players_list:
        key = str(p.get("tm_id")) if p.get("tm_id") else p["id"]
        seen[key] = p
    return list(seen.values())


# ── Export-seed mode ──────────────────────────────────────────────────────────

def run_export_seed() -> int:
    """
    Build data entirely from seed/manual sources (no HTTP requests).
    Exports to JSON, CSV, and SQLite in data/output/.
    Returns exit code (0 = success).
    """
    console.rule("[bold green]Liga MX Pipeline — Export Seed Mode")
    (
        CHAMPIONS, TEAM_REGISTRY, FORMATION_SLOTS,
        Tournament, Team, Player, LineupEntry,
        Scraper, fetch_champions_history, fetch_team_squad,
        parse_champions_history, parse_squad_page, assign_formation_order,
        build_lineup_from_squad, build_lineup_from_manual, make_player_id, normalize_name,
        export_json, export_csv, export_sqlite,
    ) = _import_pipeline()

    teams = build_teams_from_registry(TEAM_REGISTRY)
    tournaments = build_tournaments_from_seed(CHAMPIONS)
    manual_overrides = load_manual_overrides()

    all_players: List[Dict] = []
    all_lineups: List[Dict] = []

    # Stats tracking
    stats = {"seed": 0, "manual": 0, "empty": 0}

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("{task.completed}/{task.total}"),
        console=console,
    ) as progress:
        task = progress.add_task("Processing tournaments...", total=len(tournaments))

        for tourn in tournaments:
            tid = tourn["id"]
            team_id = tourn["champion_team_id"]
            year = tourn["year"]
            formation = tourn.get("formation", "4-4-2")

            # Check manual overrides first
            if tid in manual_overrides:
                override = manual_overrides[tid]
                p_list, l_list = build_lineup_from_manual(override, team_id, year, tid)
                all_players.extend(p_list)
                all_lineups.extend(l_list)
                tourn["source"] = "manual"
                stats["manual"] += 1
                logger.info(f"[{tid}] Used manual override ({len(l_list)} players)")
            else:
                # No manual data and no scrape in this mode — record as seed only
                stats["seed"] += 1
                logger.debug(f"[{tid}] Seed only — no lineup data (export-seed mode)")

            progress.advance(task)

    # Deduplicate players
    all_players = deduplicate_players(all_players)

    # Export
    _OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    console.print(f"\n[bold]Exporting to {_OUTPUT_DIR}...[/bold]")

    export_json(_OUTPUT_DIR, tournaments, teams, all_players, all_lineups)
    export_csv(_OUTPUT_DIR, tournaments, teams, all_players, all_lineups)
    export_sqlite(_DB_PATH, tournaments, teams, all_players, all_lineups)

    # Summary table
    _print_summary(tournaments, teams, all_players, all_lineups, stats)
    return 0


# ── Scrape mode ───────────────────────────────────────────────────────────────

def run_scrape(
    season_filter: Optional[str] = None,
    dry_run: bool = False,
) -> int:
    """
    Full scrape pipeline: verify champions from TM, fetch squad pages, export.
    Returns exit code (0 = success).
    """
    console.rule("[bold blue]Liga MX Pipeline — Scrape Mode")
    (
        CHAMPIONS, TEAM_REGISTRY, FORMATION_SLOTS,
        Tournament, Team, Player, LineupEntry,
        Scraper, fetch_champions_history, fetch_team_squad,
        parse_champions_history, parse_squad_page, assign_formation_order,
        build_lineup_from_squad, build_lineup_from_manual, make_player_id, normalize_name,
        export_json, export_csv, export_sqlite,
    ) = _import_pipeline()

    teams = build_teams_from_registry(TEAM_REGISTRY)
    tournaments = build_tournaments_from_seed(CHAMPIONS)
    manual_overrides = load_manual_overrides()

    # Filter to single season if requested
    if season_filter:
        tournaments = [t for t in tournaments if t["id"] == season_filter]
        if not tournaments:
            console.print(f"[red]Season '{season_filter}' not found in seed data.[/red]")
            return 1

    if dry_run:
        console.print("[yellow]DRY RUN — no HTTP requests will be made.[/yellow]\n")
        table = Table(title="Tournaments to scrape", show_lines=True)
        table.add_column("ID", style="cyan")
        table.add_column("Team")
        table.add_column("Formation")
        table.add_column("Needs Verification")
        for t in tournaments:
            table.add_row(
                t["id"],
                t["champion_team_id"],
                t.get("formation", ""),
                str(t.get("needs_verification", False)),
            )
        console.print(table)
        return 0

    all_players: List[Dict] = []
    all_lineups: List[Dict] = []
    stats = {"scraped": 0, "manual": 0, "failed": 0, "skipped": 0}

    # Build a TM-ID → team_id reverse lookup
    tm_id_to_team = {
        info["tm_id"]: tid
        for tid, info in TEAM_REGISTRY.items()
        if info.get("tm_id")
    }

    with Scraper() as scraper:
        # Step 1: Try to verify/correct champions from TM history page
        console.print("[dim]Fetching TM champions history for verification...[/dim]")
        try:
            history_soup = fetch_champions_history(scraper)
            if history_soup:
                history_records = parse_champions_history(history_soup)
                logger.info(f"Fetched {len(history_records)} records from TM history page")
                # Update runner_up info from TM where available
                for record in history_records:
                    pass  # Verification: cross-check would update needs_verification flags
            else:
                logger.warning("Could not fetch TM history page; proceeding with seed data")
        except Exception as e:
            logger.error(f"History fetch failed: {e}")

        # Step 2: Scrape squad for each tournament
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TextColumn("{task.completed}/{task.total}"),
            console=console,
        ) as progress:
            task = progress.add_task("Scraping squad pages...", total=len(tournaments))

            for tourn in tournaments:
                tid = tourn["id"]
                team_id = tourn["champion_team_id"]
                year = tourn["year"]
                formation = tourn.get("formation", "4-4-2")

                progress.update(task, description=f"[cyan]{tid}[/cyan]")

                try:
                    # Priority: manual overrides > scraped data
                    if tid in manual_overrides:
                        override = manual_overrides[tid]
                        p_list, l_list = build_lineup_from_manual(override, team_id, year, tid)
                        all_players.extend(p_list)
                        all_lineups.extend(l_list)
                        tourn["source"] = "manual"
                        stats["manual"] += 1
                        logger.info(f"[{tid}] Manual override used ({len(l_list)} players)")

                    else:
                        # Try scraping squad page
                        team_info = TEAM_REGISTRY.get(team_id, {})
                        tm_id = team_info.get("tm_id")
                        tm_slug = team_info.get("slug")

                        if not tm_id or not tm_slug:
                            logger.warning(f"[{tid}] No TM info for {team_id} — skipping scrape")
                            stats["skipped"] += 1
                        else:
                            squad_soup = fetch_team_squad(scraper, tm_slug, tm_id, year)
                            if squad_soup:
                                squad_players = parse_squad_page(squad_soup)
                                if squad_players:
                                    p_list, l_list = build_lineup_from_squad(
                                        squad_players, formation, team_id, year, tid
                                    )
                                    all_players.extend(p_list)
                                    all_lineups.extend(l_list)
                                    tourn["source"] = "scraped"
                                    stats["scraped"] += 1
                                    logger.info(f"[{tid}] Scraped {len(l_list)} players")
                                else:
                                    logger.warning(f"[{tid}] Squad page returned no players")
                                    stats["failed"] += 1
                            else:
                                logger.warning(f"[{tid}] Could not fetch squad page")
                                stats["failed"] += 1

                except Exception as e:
                    logger.error(f"[{tid}] Error: {e} — continuing")
                    stats["failed"] += 1

                progress.advance(task)

    # Deduplicate players
    all_players = deduplicate_players(all_players)

    # Export
    _OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    console.print(f"\n[bold]Exporting to {_OUTPUT_DIR}...[/bold]")

    export_json(_OUTPUT_DIR, tournaments, teams, all_players, all_lineups)
    export_csv(_OUTPUT_DIR, tournaments, teams, all_players, all_lineups)
    export_sqlite(_DB_PATH, tournaments, teams, all_players, all_lineups)

    _print_summary(tournaments, teams, all_players, all_lineups, stats)
    return 0


# ── Summary printer ────────────────────────────────────────────────────────────

def _print_summary(
    tournaments: List[Dict],
    teams: List[Dict],
    players: List[Dict],
    lineups: List[Dict],
    stats: Dict,
) -> None:
    """Print a rich summary table of pipeline results."""
    console.rule("[bold]Pipeline Summary")

    # Stats table
    stats_table = Table(show_header=False, box=None)
    stats_table.add_column("Metric", style="bold cyan")
    stats_table.add_column("Value", style="white")
    stats_table.add_row("Tournaments processed", str(len(tournaments)))
    stats_table.add_row("Unique teams", str(len(teams)))
    stats_table.add_row("Unique players", str(len(players)))
    stats_table.add_row("Lineup entries", str(len(lineups)))
    for key, val in stats.items():
        stats_table.add_row(f"  source:{key}", str(val))
    console.print(stats_table)
    console.print()

    # Per-tournament breakdown (last 10 for readability)
    tourn_table = Table(
        title="Tournament Results (last 10)",
        show_lines=False,
        highlight=True,
    )
    tourn_table.add_column("Tournament", style="cyan", no_wrap=True)
    tourn_table.add_column("Champion")
    tourn_table.add_column("Formation")
    tourn_table.add_column("Players", justify="right")
    tourn_table.add_column("Source")

    # Build lineup count per tournament
    lineup_counts: Dict[str, int] = {}
    for entry in lineups:
        tid = entry.get("tournament_id", "")
        lineup_counts[tid] = lineup_counts.get(tid, 0) + 1

    for t in tournaments[-10:]:
        tourn_table.add_row(
            t["id"],
            t["champion_team_id"],
            t.get("formation", "—"),
            str(lineup_counts.get(t["id"], 0)),
            t.get("source", "seed"),
        )

    console.print(tourn_table)
    console.print(f"\n[green]Output written to:[/green] {_OUTPUT_DIR}")
    console.print(f"[green]SQLite DB:[/green]       {_DB_PATH}")


# ── CLI entry point ────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        prog="pipeline",
        description="Liga MX Champions historical data pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    subparsers = parser.add_subparsers(dest="command", help="Pipeline command")

    # scrape subcommand
    scrape_parser = subparsers.add_parser(
        "scrape", help="Scrape Transfermarkt and export data"
    )
    scrape_parser.add_argument(
        "--season",
        metavar="SEASON_ID",
        help="Process only this season (e.g. apertura-2023)",
    )
    scrape_parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be scraped without making requests",
    )
    scrape_parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable debug logging",
    )

    # export-seed subcommand
    seed_parser = subparsers.add_parser(
        "export-seed",
        help="Export seed data only without scraping",
    )
    seed_parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable debug logging",
    )

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 1

    # Adjust log level
    verbose = getattr(args, "verbose", False)
    if verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.command == "export-seed":
        return run_export_seed()
    elif args.command == "scrape":
        return run_scrape(
            season_filter=getattr(args, "season", None),
            dry_run=getattr(args, "dry_run", False),
        )
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())
