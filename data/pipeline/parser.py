"""
parser.py — Extract structured data from Transfermarkt HTML pages.
All functions accept a BeautifulSoup object and return dicts/lists.
"""
import re
import logging
import unicodedata
from typing import List, Dict, Optional, Tuple
from bs4 import BeautifulSoup, Tag
from .constants import POSITION_GROUP_MAP, POSITION_EXACT_MAP, FORMATION_SLOTS

logger = logging.getLogger(__name__)


# ── Text utilities ──────────────────────────────────────────────────────────

def normalize_name(name: str) -> str:
    """
    Lowercase, remove accents, strip, collapse spaces.
    Used for deduplication and ID generation.
    """
    if not name:
        return ""
    # Normalize unicode to decompose accents
    nfkd = unicodedata.normalize("NFKD", name)
    # Keep only ASCII characters (drops combining accent marks)
    ascii_str = nfkd.encode("ascii", "ignore").decode("ascii")
    # Lowercase, strip, collapse whitespace
    return " ".join(ascii_str.lower().split())


def slugify(name: str) -> str:
    """
    Convert a player name to a URL-safe slug.
    e.g. "Cuauhtémoc Blanco" -> "cuauhtemoc-blanco"
    """
    normalized = normalize_name(name)
    # Replace spaces with hyphens, remove non-alphanumeric characters
    slug = re.sub(r"[^a-z0-9\s-]", "", normalized)
    slug = re.sub(r"[\s]+", "-", slug.strip())
    return slug


def make_player_id(team_id: str, year: int, player_name: str, tm_id: Optional[int] = None) -> str:
    """
    Generate a unique player ID.
    Prefers TM ID if available, otherwise uses slug pattern.
    """
    if tm_id:
        return str(tm_id)
    return f"{team_id}-{year}-{slugify(player_name)}"


# ── Champions history ───────────────────────────────────────────────────────

def parse_champions_history(soup: BeautifulSoup) -> List[Dict]:
    """
    Parse the Liga MX history page from Transfermarkt.
    Returns list of {season_label, team_name, team_tm_id, team_slug, runner_up}.
    """
    results = []
    try:
        # TM history tables have class "items"
        table = soup.find("table", class_="items")
        if not table:
            logger.warning("Champions history table not found")
            return results

        for row in table.find_all("tr", class_=["odd", "even"]):
            cells = row.find_all("td")
            if len(cells) < 3:
                continue
            try:
                season_label = cells[0].get_text(strip=True)
                # Champion is in cells[1] or cells[2] — find the link to the team
                champion_link = cells[1].find("a", href=re.compile(r"/startseite/verein/\d+"))
                runner_up_link = (
                    cells[2].find("a", href=re.compile(r"/startseite/verein/\d+"))
                    if len(cells) > 2
                    else None
                )

                if champion_link:
                    href = champion_link.get("href", "")
                    tm_id_match = re.search(r"/verein/(\d+)", href)
                    slug_match = re.match(r"/([^/]+)/", href)
                    results.append({
                        "season_label":   season_label,
                        "team_name":      champion_link.get_text(strip=True),
                        "team_tm_id":     int(tm_id_match.group(1)) if tm_id_match else None,
                        "team_slug":      slug_match.group(1) if slug_match else None,
                        "runner_up_name": runner_up_link.get_text(strip=True) if runner_up_link else None,
                    })
            except Exception as e:
                logger.debug(f"Skipping row: {e}")
                continue
    except Exception as e:
        logger.error(f"Error parsing champions history: {e}")
    return results


# ── Squad page ──────────────────────────────────────────────────────────────

def parse_squad_page(soup: BeautifulSoup) -> List[Dict]:
    """
    Parse a team's squad page from Transfermarkt.
    Returns list of player dicts with name, tm_id, position, shirt_number.
    """
    players = []
    try:
        table = soup.find("table", class_="items")
        if not table:
            logger.warning("Squad table not found")
            return players

        for row in table.find_all("tr", class_=["odd", "even"]):
            try:
                player = _parse_squad_row(row)
                if player:
                    players.append(player)
            except Exception as e:
                logger.debug(f"Skipping squad row: {e}")
                continue
    except Exception as e:
        logger.error(f"Error parsing squad: {e}")
    return players


def _parse_squad_row(row: Tag) -> Optional[Dict]:
    """Extract one player from a squad table row."""
    cells = row.find_all("td")
    if len(cells) < 5:
        return None

    # Shirt number — first td with class "rn_nummer"
    shirt_td = row.find("td", class_="rn_nummer")
    shirt_number = None
    if shirt_td:
        try:
            shirt_number = int(shirt_td.get_text(strip=True))
        except ValueError:
            pass

    # Player name and TM link — try multiple selectors
    name_link = row.find("a", class_="spielprofil_tooltip")
    if not name_link:
        hauptlink_td = row.find("td", class_="hauptlink")
        if hauptlink_td:
            name_link = hauptlink_td.find("a")
    if not name_link:
        # Last resort: any anchor with /profil/spieler/ in href
        name_link = row.find("a", href=re.compile(r"/profil/spieler/\d+"))
    if not name_link:
        return None

    name = name_link.get_text(strip=True)
    if not name:
        return None

    href = name_link.get("href", "")
    tm_id_match = re.search(r"/profil/spieler/(\d+)", href)
    tm_id = int(tm_id_match.group(1)) if tm_id_match else None

    # Position — search all cells for a known position label
    position_raw = ""
    for td in row.find_all("td"):
        text = td.get_text(strip=True)
        if text in POSITION_GROUP_MAP or text in POSITION_EXACT_MAP:
            position_raw = text
            break

    # Nationality — image flag
    nationality = None
    flag_img = row.find("img", class_="flaggenrahmen")
    if flag_img:
        nationality = flag_img.get("title", "")
    if not nationality:
        # Try alt attribute
        flag_img2 = row.find("img", attrs={"title": True})
        if flag_img2:
            title = flag_img2.get("title", "")
            # Only use if it looks like a country (not a player name)
            if title and len(title) < 50 and title not in (name,):
                nationality = title

    return {
        "name":         name,
        "tm_id":        tm_id,
        "shirt_number": shirt_number,
        "position_raw": position_raw,
        "nationality":  nationality,
    }


# ── Match lineup ────────────────────────────────────────────────────────────

def parse_match_lineup(soup: BeautifulSoup) -> Dict:
    """
    Parse a Transfermarkt match page to extract starting lineups for both teams.
    Returns {"home": [...], "away": [...], "formation_home": "4-3-3", "formation_away": "4-4-2"}.
    """
    result = {"home": [], "away": [], "formation_home": None, "formation_away": None}
    try:
        # TM lineup sections are in div.startelfblock
        lineup_blocks = soup.find_all("div", class_="startelfblock")
        for i, block in enumerate(lineup_blocks[:2]):
            side = "home" if i == 0 else "away"

            # Formation label — try several selectors
            formation_div = block.find("div", class_=re.compile(r"formation", re.I))
            if formation_div:
                result[f"formation_{side}"] = formation_div.get_text(strip=True)
            else:
                # Try to find it in a header element
                for tag in block.find_all(["h2", "h3", "span"]):
                    text = tag.get_text(strip=True)
                    if re.match(r"\d-\d", text):
                        result[f"formation_{side}"] = text
                        break

            # Players — find all player tooltip links in this block
            for player_tag in block.find_all("a", class_="spielprofil_tooltip"):
                href = player_tag.get("href", "")
                tm_id_match = re.search(r"/profil/spieler/(\d+)", href)
                name = player_tag.get("title", player_tag.get_text(strip=True))
                shirt = None

                # Shirt number is often in a sibling element
                parent = player_tag.find_parent()
                if parent:
                    shirt_div = parent.find(
                        "div", class_=re.compile(r"rueckennummer|shirt|nummer", re.I)
                    )
                    if shirt_div:
                        try:
                            shirt = int(shirt_div.get_text(strip=True))
                        except ValueError:
                            pass

                result[side].append({
                    "name":  name,
                    "tm_id": int(tm_id_match.group(1)) if tm_id_match else None,
                    "shirt": shirt,
                })
    except Exception as e:
        logger.error(f"Error parsing match lineup: {e}")
    return result


# ── Position resolution ─────────────────────────────────────────────────────

def resolve_position(position_raw: str) -> Tuple[str, str]:
    """
    Map a raw Transfermarkt position string to (position_group, position_exact).
    Falls back to ("MID", "CM") if unknown.
    """
    group = POSITION_GROUP_MAP.get(position_raw, "MID")
    exact = POSITION_EXACT_MAP.get(position_raw, position_raw if position_raw else "CM")
    return group, exact


# ── Formation order assignment ──────────────────────────────────────────────

def assign_formation_order(players: List[Dict], formation: str) -> List[Dict]:
    """
    Assign formation_order (1-11) to each player based on position group and formation.

    Players are sorted: GK first, then defenders, midfielders, forwards.
    Within each group, order is determined by their index among same-group players.

    Args:
        players: list of dicts with at least 'position_raw' or 'position_group' keys.
        formation: string like "4-3-3"

    Returns:
        Same list of player dicts with 'formation_order', 'position_group', 'position_exact' set.
    """
    slots = FORMATION_SLOTS.get(formation, FORMATION_SLOTS.get("4-3-3"))

    # Resolve positions for all players
    for p in players:
        pos_raw = p.get("position_raw", "")
        group, exact = resolve_position(pos_raw)
        p["position_group"] = group
        p["position_exact"] = exact

    # Separate into groups preserving original order
    groups: Dict[str, List[Dict]] = {"GK": [], "DEF": [], "MID": [], "FWD": []}
    unassigned = []
    for p in players:
        g = p.get("position_group", "MID")
        if g in groups:
            groups[g].append(p)
        else:
            unassigned.append(p)

    # Build ordered list matching the slots
    # slots: e.g. ["GK","LB","CB","CB","RB","CM","CM","CM","LW","ST","RW"]
    # We track how many from each group we've consumed
    group_counters: Dict[str, int] = {"GK": 0, "DEF": 0, "MID": 0, "FWD": 0}

    # Map slot position labels to group
    slot_group_map = {
        "GK": "GK",
        "LB": "DEF", "RB": "DEF", "CB": "DEF", "LWB": "DEF", "RWB": "DEF",
        "CM": "MID", "CDM": "MID", "CAM": "MID", "LM": "MID", "RM": "MID",
        "ST": "FWD", "LW": "FWD", "RW": "FWD", "CF": "FWD", "SS": "FWD",
    }

    ordered_players: List[Optional[Dict]] = [None] * 11

    for slot_idx, slot_pos in enumerate(slots[:11]):
        slot_grp = slot_group_map.get(slot_pos, "MID")
        cnt = group_counters[slot_grp]
        available = groups[slot_grp]
        if cnt < len(available):
            player = available[cnt]
            player["formation_order"] = slot_idx + 1  # 1-based
            ordered_players[slot_idx] = player
            group_counters[slot_grp] += 1

    # Assign any remaining unassigned players (squad list longer than 11)
    # or if group counts didn't line up perfectly
    assigned_ids = {id(p) for p in ordered_players if p is not None}
    leftover_order = 12
    for p in players:
        if id(p) not in assigned_ids:
            p["formation_order"] = leftover_order
            leftover_order += 1

    return players


# ── Squad-to-starting-lineup conversion ────────────────────────────────────

def build_lineup_from_squad(
    squad_players: List[Dict],
    formation: str,
    team_id: str,
    year: int,
    tournament_id: str,
) -> Tuple[List[Dict], List[Dict]]:
    """
    Convert a squad page player list into lineup entries.

    Returns:
        (players_data, lineup_entries) — two lists of dicts ready for export.
        Players are deduplicated by TM ID; lineups reference their player IDs.
        Only up to 11 starters are generated (first 11 by formation order).
    """
    # Resolve and assign formation orders
    players_copy = [dict(p) for p in squad_players]
    players_copy = assign_formation_order(players_copy, formation)

    # Sort by formation order and take top 11 starters
    players_sorted = sorted(players_copy, key=lambda p: p.get("formation_order", 99))
    starters = players_sorted[:11]

    players_out = []
    lineups_out = []

    for p in starters:
        player_id = make_player_id(team_id, year, p["name"], p.get("tm_id"))
        players_out.append({
            "id":                player_id,
            "name":              p["name"],
            "nationality":       p.get("nationality"),
            "preferred_position": p.get("position_exact", "CM"),
            "tm_id":             p.get("tm_id"),
        })
        lineups_out.append({
            "tournament_id":   tournament_id,
            "team_id":         team_id,
            "player_id":       player_id,
            "shirt_number":    p.get("shirt_number"),
            "position_group":  p.get("position_group", "MID"),
            "position_exact":  p.get("position_exact", "CM"),
            "formation_order": p.get("formation_order", 1),
            "starter":         True,
        })

    return players_out, lineups_out


def build_lineup_from_manual(
    manual_entry: Dict,
    team_id: str,
    year: int,
    tournament_id: str,
) -> Tuple[List[Dict], List[Dict]]:
    """
    Convert a manual override entry into players + lineup entries.
    manual_entry matches the structure in lineups_override.json.
    """
    players_out = []
    lineups_out = []

    for p in manual_entry.get("players", []):
        player_id = make_player_id(team_id, year, p["name"], p.get("tm_id"))
        players_out.append({
            "id":                player_id,
            "name":              p["name"],
            "nationality":       p.get("nationality"),
            "preferred_position": p.get("position_exact", "CM"),
            "tm_id":             p.get("tm_id"),
        })
        lineups_out.append({
            "tournament_id":   tournament_id,
            "team_id":         team_id,
            "player_id":       player_id,
            "shirt_number":    p.get("shirt_number"),
            "position_group":  p.get("position_group", "MID"),
            "position_exact":  p.get("position_exact", "CM"),
            "formation_order": p.get("formation_order", 1),
            "starter":         p.get("starter", True),
        })

    return players_out, lineups_out
