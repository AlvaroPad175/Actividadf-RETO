"""
exporter.py — Export pipeline data to JSON, CSV, and SQLite formats.
All functions are pure I/O: they accept plain dicts/lists and write files.
"""
import csv
import json
import sqlite3
import logging
from pathlib import Path
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


# ── Helpers ─────────────────────────────────────────────────────────────────

def _ensure_dir(path: Path) -> None:
    """Create directory (and parents) if it does not exist."""
    path.mkdir(parents=True, exist_ok=True)


def _tournament_to_dict(t: Any) -> Dict:
    """Convert Tournament dataclass or dict to a plain dict for export."""
    if isinstance(t, dict):
        return t
    return {
        "id":               t.id,
        "year":             t.year,
        "season_type":      t.season_type,
        "champion_team_id": t.champion_team_id,
        "formation":        t.formation,
        "runner_up_team_id": t.runner_up_team_id,
        "source":           t.source,
        "needs_verification": t.needs_verification,
    }


def _team_to_dict(t: Any) -> Dict:
    if isinstance(t, dict):
        return t
    return {
        "id":       t.id,
        "name":     t.name,
        "tm_id":    t.tm_id,
        "tm_slug":  t.tm_slug,
        "logo_url": t.logo_url,
    }


def _player_to_dict(p: Any) -> Dict:
    if isinstance(p, dict):
        return p
    return {
        "id":                 p.id,
        "name":               p.name,
        "nationality":        p.nationality,
        "preferred_position": p.preferred_position,
        "tm_id":              p.tm_id,
    }


def _lineup_to_dict(e: Any) -> Dict:
    if isinstance(e, dict):
        return e
    return {
        "tournament_id":   e.tournament_id,
        "team_id":         e.team_id,
        "player_id":       e.player_id,
        "shirt_number":    e.shirt_number,
        "position_group":  e.position_group,
        "position_exact":  e.position_exact,
        "formation_order": e.formation_order,
        "starter":         e.starter,
    }


# ── JSON export ──────────────────────────────────────────────────────────────

def export_json(
    output_dir: str | Path,
    tournaments: List[Any],
    teams: List[Any],
    players: List[Any],
    lineups: List[Any],
) -> None:
    """
    Write three JSON files to output_dir:
      - champions.json    (tournaments)
      - players.json      (players)
      - lineups.json      (lineup entries)
    """
    out = Path(output_dir)
    _ensure_dir(out)

    tournaments_data = [_tournament_to_dict(t) for t in tournaments]
    teams_data       = [_team_to_dict(t) for t in teams]
    players_data     = [_player_to_dict(p) for p in players]
    lineups_data     = [_lineup_to_dict(e) for e in lineups]

    # champions.json — tournaments enriched with team name
    team_index = {td["id"]: td for td in teams_data}
    champions_enriched = []
    for t in tournaments_data:
        entry = dict(t)
        team_info = team_index.get(t["champion_team_id"], {})
        entry["champion_team_name"] = team_info.get("name", t["champion_team_id"])
        champions_enriched.append(entry)

    champions_path = out / "champions.json"
    with open(champions_path, "w", encoding="utf-8") as f:
        json.dump(champions_enriched, f, ensure_ascii=False, indent=2)
    logger.info(f"Wrote {len(champions_enriched)} tournaments to {champions_path}")

    players_path = out / "players.json"
    with open(players_path, "w", encoding="utf-8") as f:
        json.dump(players_data, f, ensure_ascii=False, indent=2)
    logger.info(f"Wrote {len(players_data)} players to {players_path}")

    lineups_path = out / "lineups.json"
    with open(lineups_path, "w", encoding="utf-8") as f:
        json.dump(lineups_data, f, ensure_ascii=False, indent=2)
    logger.info(f"Wrote {len(lineups_data)} lineup entries to {lineups_path}")


# ── CSV export ───────────────────────────────────────────────────────────────

def export_csv(
    output_dir: str | Path,
    tournaments: List[Any],
    teams: List[Any],
    players: List[Any],
    lineups: List[Any],
) -> None:
    """
    Write lineups.csv to output_dir.
    Each row includes denormalized tournament, team, and player data for convenience.
    """
    out = Path(output_dir)
    _ensure_dir(out)

    tournaments_data = [_tournament_to_dict(t) for t in tournaments]
    teams_data       = [_team_to_dict(t) for t in teams]
    players_data     = [_player_to_dict(p) for p in players]
    lineups_data     = [_lineup_to_dict(e) for e in lineups]

    # Build lookup indexes
    tournament_index = {td["id"]: td for td in tournaments_data}
    team_index       = {td["id"]: td for td in teams_data}
    player_index     = {pd["id"]: pd for pd in players_data}

    fieldnames = [
        "tournament_id", "season_type", "year",
        "team_id", "team_name",
        "player_id", "player_name", "nationality",
        "shirt_number", "position_group", "position_exact",
        "formation_order", "starter",
        "formation", "source", "needs_verification",
    ]

    csv_path = out / "lineups.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for entry in lineups_data:
            tourn = tournament_index.get(entry["tournament_id"], {})
            team  = team_index.get(entry["team_id"], {})
            player = player_index.get(entry["player_id"], {})
            row = {
                "tournament_id":      entry["tournament_id"],
                "season_type":        tourn.get("season_type", ""),
                "year":               tourn.get("year", ""),
                "team_id":            entry["team_id"],
                "team_name":          team.get("name", entry["team_id"]),
                "player_id":          entry["player_id"],
                "player_name":        player.get("name", entry["player_id"]),
                "nationality":        player.get("nationality", ""),
                "shirt_number":       entry.get("shirt_number", ""),
                "position_group":     entry.get("position_group", ""),
                "position_exact":     entry.get("position_exact", ""),
                "formation_order":    entry.get("formation_order", ""),
                "starter":            entry.get("starter", True),
                "formation":          tourn.get("formation", ""),
                "source":             tourn.get("source", ""),
                "needs_verification": tourn.get("needs_verification", False),
            }
            writer.writerow(row)

    logger.info(f"Wrote {len(lineups_data)} rows to {csv_path}")


# ── SQLite export ─────────────────────────────────────────────────────────────

def export_sqlite(
    db_path: str | Path,
    tournaments: List[Any],
    teams: List[Any],
    players: List[Any],
    lineups: List[Any],
) -> None:
    """
    Create (or update) a SQLite database at db_path.

    Tables:
        teams(id, name, logo_url)
        tournaments(id, year, season_type, champion_team_id, formation, source, needs_verification)
        players(id, name, nationality, preferred_position, tm_id)
        lineups(id, tournament_id, team_id, player_id, shirt_number,
                position_group, position_exact, formation_order, starter)
    """
    db = Path(db_path)
    _ensure_dir(db.parent)

    tournaments_data = [_tournament_to_dict(t) for t in tournaments]
    teams_data       = [_team_to_dict(t) for t in teams]
    players_data     = [_player_to_dict(p) for p in players]
    lineups_data     = [_lineup_to_dict(e) for e in lineups]

    conn = sqlite3.connect(str(db))
    cur = conn.cursor()

    # Enable WAL mode for better concurrency
    cur.execute("PRAGMA journal_mode=WAL")
    cur.execute("PRAGMA foreign_keys=ON")

    # Create tables
    cur.executescript("""
        CREATE TABLE IF NOT EXISTS teams (
            id       TEXT PRIMARY KEY,
            name     TEXT NOT NULL,
            logo_url TEXT
        );

        CREATE TABLE IF NOT EXISTS tournaments (
            id                  TEXT PRIMARY KEY,
            year                INTEGER NOT NULL,
            season_type         TEXT NOT NULL,
            champion_team_id    TEXT NOT NULL,
            formation           TEXT,
            runner_up_team_id   TEXT,
            source              TEXT NOT NULL DEFAULT 'seed',
            needs_verification  INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (champion_team_id) REFERENCES teams(id)
        );

        CREATE TABLE IF NOT EXISTS players (
            id                  TEXT PRIMARY KEY,
            name                TEXT NOT NULL,
            nationality         TEXT,
            preferred_position  TEXT,
            tm_id               INTEGER
        );

        CREATE TABLE IF NOT EXISTS lineups (
            id              TEXT PRIMARY KEY,
            tournament_id   TEXT NOT NULL,
            team_id         TEXT NOT NULL,
            player_id       TEXT NOT NULL,
            shirt_number    INTEGER,
            position_group  TEXT NOT NULL,
            position_exact  TEXT,
            formation_order INTEGER NOT NULL,
            starter         INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
            FOREIGN KEY (team_id)       REFERENCES teams(id),
            FOREIGN KEY (player_id)     REFERENCES players(id)
        );

        CREATE INDEX IF NOT EXISTS idx_lineups_tournament ON lineups(tournament_id);
        CREATE INDEX IF NOT EXISTS idx_lineups_player     ON lineups(player_id);
        CREATE INDEX IF NOT EXISTS idx_lineups_team       ON lineups(team_id);
    """)

    # Insert teams
    for t in teams_data:
        cur.execute(
            "INSERT OR REPLACE INTO teams(id, name, logo_url) VALUES (?, ?, ?)",
            (t["id"], t["name"], t.get("logo_url")),
        )

    # Insert tournaments
    for t in tournaments_data:
        cur.execute(
            """INSERT OR REPLACE INTO tournaments
               (id, year, season_type, champion_team_id, formation,
                runner_up_team_id, source, needs_verification)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                t["id"],
                t["year"],
                t["season_type"],
                t["champion_team_id"],
                t.get("formation"),
                t.get("runner_up_team_id"),
                t.get("source", "seed"),
                int(t.get("needs_verification", False)),
            ),
        )

    # Insert players
    for p in players_data:
        cur.execute(
            """INSERT OR REPLACE INTO players
               (id, name, nationality, preferred_position, tm_id)
               VALUES (?, ?, ?, ?, ?)""",
            (
                p["id"],
                p["name"],
                p.get("nationality"),
                p.get("preferred_position"),
                p.get("tm_id"),
            ),
        )

    # Insert lineups — generate composite ID from tournament + player
    for e in lineups_data:
        lineup_id = f"{e['tournament_id']}-{e['player_id']}"
        cur.execute(
            """INSERT OR REPLACE INTO lineups
               (id, tournament_id, team_id, player_id, shirt_number,
                position_group, position_exact, formation_order, starter)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                lineup_id,
                e["tournament_id"],
                e["team_id"],
                e["player_id"],
                e.get("shirt_number"),
                e.get("position_group", "MID"),
                e.get("position_exact"),
                e.get("formation_order", 1),
                int(e.get("starter", True)),
            ),
        )

    conn.commit()
    conn.close()

    # Report row counts
    conn2 = sqlite3.connect(str(db))
    cur2 = conn2.cursor()
    counts = {}
    for tbl in ("teams", "tournaments", "players", "lineups"):
        cur2.execute(f"SELECT COUNT(*) FROM {tbl}")
        counts[tbl] = cur2.fetchone()[0]
    conn2.close()

    logger.info(
        f"SQLite DB at {db}: "
        f"{counts['teams']} teams, "
        f"{counts['tournaments']} tournaments, "
        f"{counts['players']} players, "
        f"{counts['lineups']} lineup entries"
    )
