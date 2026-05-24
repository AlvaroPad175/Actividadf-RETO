"""
constants.py — Configuration constants for the Liga MX Champions pipeline.
"""

# ── Transfermarkt URLs ──────────────────────────────────────────────────────

TM_BASE = "https://www.transfermarkt.com"
TM_LIGA_MX_HISTORY = f"{TM_BASE}/liga-mx/historie/wettbewerb/MEX1"
TM_LIGA_MX_SEASON  = f"{TM_BASE}/liga-mx/startseite/wettbewerb/MEX1/saison_id/{{year}}"
TM_TEAM_SQUAD      = f"{TM_BASE}/{{slug}}/startseite/verein/{{tm_id}}/saison_id/{{year}}"
TM_MATCH           = f"{TM_BASE}/spielbericht/index/spielbericht/{{match_id}}"
TM_COMPETITION_MATCHES = f"{TM_BASE}/liga-mx/spielplan/wettbewerb/MEX1/saison_id/{{year}}"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": "https://www.transfermarkt.com/",
}

REQUEST_DELAY = 3.0   # seconds between requests (be respectful)
MAX_RETRIES   = 3

# ── Position mappings ───────────────────────────────────────────────────────

POSITION_GROUP_MAP = {
    # GK
    "Portero": "GK", "Goalkeeper": "GK", "GK": "GK",
    # DEF
    "Defensa central": "DEF", "Lateral derecho": "DEF", "Lateral izquierdo": "DEF",
    "Centre-Back": "DEF", "Right-Back": "DEF", "Left-Back": "DEF",
    "CB": "DEF", "RB": "DEF", "LB": "DEF", "RWB": "DEF", "LWB": "DEF",
    # MID
    "Mediocampista central": "MID", "Mediocampista defensivo": "MID",
    "Mediocampista ofensivo": "MID", "Interior derecho": "MID", "Interior izquierdo": "MID",
    "Central Midfield": "MID", "Defensive Midfield": "MID", "Attacking Midfield": "MID",
    "Right Midfield": "MID", "Left Midfield": "MID",
    "CM": "MID", "CDM": "MID", "CAM": "MID", "RM": "MID", "LM": "MID",
    # FWD
    "Delantero centro": "FWD", "Extremo derecho": "FWD", "Extremo izquierdo": "FWD",
    "Second Striker": "FWD", "Centre-Forward": "FWD",
    "ST": "FWD", "CF": "FWD", "RW": "FWD", "LW": "FWD", "SS": "FWD",
}

POSITION_EXACT_MAP = {
    "Portero": "GK", "Goalkeeper": "GK",
    "Defensa central": "CB", "Centre-Back": "CB",
    "Lateral derecho": "RB", "Right-Back": "RB",
    "Lateral izquierdo": "LB", "Left-Back": "LB",
    "Carrilero derecho": "RWB", "Right Wing-Back": "RWB",
    "Carrilero izquierdo": "LWB", "Left Wing-Back": "LWB",
    "Mediocampista defensivo": "CDM", "Defensive Midfield": "CDM",
    "Mediocampista central": "CM", "Central Midfield": "CM",
    "Interior derecho": "CM", "Interior izquierdo": "CM",
    "Mediocampista ofensivo": "CAM", "Attacking Midfield": "CAM",
    "Mediocampista derecho": "RM", "Right Midfield": "RM",
    "Mediocampista izquierdo": "LM", "Left Midfield": "LM",
    "Extremo derecho": "RW", "Right Winger": "RW",
    "Extremo izquierdo": "LW", "Left Winger": "LW",
    "Segundo delantero": "SS", "Second Striker": "SS",
    "Delantero centro": "ST", "Centre-Forward": "ST",
}

# ── Formation slot definitions ──────────────────────────────────────────────
# formation_order: 1=GK, then rows from back to front, left to right within row

FORMATION_SLOTS = {
    "4-3-3":   ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"],
    "4-4-2":   ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "RM", "ST", "ST"],
    "4-2-3-1": ["GK", "LB", "CB", "CB", "RB", "CDM", "CDM", "LW", "CAM", "RW", "ST"],
    "3-5-2":   ["GK", "CB", "CB", "CB", "LWB", "CM", "CM", "CM", "RWB", "ST", "ST"],
    "4-1-4-1": ["GK", "LB", "CB", "CB", "RB", "CDM", "LM", "CM", "CM", "RM", "ST"],
    "5-3-2":   ["GK", "LWB", "CB", "CB", "CB", "RWB", "CM", "CM", "CM", "ST", "ST"],
    "4-5-1":   ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "CM", "RM", "ST"],
    "3-4-3":   ["GK", "CB", "CB", "CB", "LM", "CM", "CM", "RM", "LW", "ST", "RW"],
}

# ── Team registry ───────────────────────────────────────────────────────────

TEAM_REGISTRY = {
    # ── Equipos campeones ────────────────────────────────────────────────────
    "club-america":        {"name": "Club América",           "tm_id": 136,   "slug": "club-america"},
    "chivas-guadalajara":  {"name": "Chivas Guadalajara",     "tm_id": 135,   "slug": "chivas-guadalajara"},
    "cruz-azul":           {"name": "Cruz Azul",              "tm_id": 785,   "slug": "cruz-azul"},
    "pumas-unam":          {"name": "Pumas UNAM",             "tm_id": 793,   "slug": "pumas-unam"},
    "deportivo-toluca":    {"name": "Deportivo Toluca",       "tm_id": 1430,  "slug": "deportivo-toluca-fc"},
    "santos-laguna":       {"name": "Santos Laguna",          "tm_id": 789,   "slug": "santos-laguna"},
    "cf-monterrey":        {"name": "CF Monterrey",           "tm_id": 1757,  "slug": "cf-monterrey"},
    "tigres-uanl":         {"name": "Tigres UANL",            "tm_id": 1772,  "slug": "tigres-uanl"},
    "necaxa":              {"name": "Necaxa",                 "tm_id": 756,   "slug": "club-necaxa"},
    "cf-pachuca":          {"name": "CF Pachuca",             "tm_id": 788,   "slug": "cf-pachuca"},
    "atlas-fc":            {"name": "Atlas FC",               "tm_id": 2023,  "slug": "atlas-fc"},
    "atlante":             {"name": "Atlante FC",             "tm_id": 9597,  "slug": "atlante-fc"},
    "club-leon":           {"name": "Club León",              "tm_id": 9469,  "slug": "club-leon"},
    "club-tijuana":        {"name": "Club Tijuana",           "tm_id": 20186, "slug": "club-tijuana"},
    "monarcas-morelia":    {"name": "Monarcas Morelia",       "tm_id": 2006,  "slug": "monarcas-morelia"},
    # ── Equipos subcampeones / históricos ────────────────────────────────────
    "toros-neza":          {"name": "Toros Neza",             "tm_id": None,  "slug": "toros-neza"},
    "tecos-uag":           {"name": "Tecos UAG",              "tm_id": None,  "slug": "estudiantes-tecos"},
    "atletico-san-luis":   {"name": "Atlético San Luis",      "tm_id": 2302,  "slug": "atletico-de-san-luis"},
    "queretaro-fc":        {"name": "Querétaro FC",           "tm_id": 13877, "slug": "queretaro-fc"},
    "veracruz":            {"name": "Tiburones Rojos",        "tm_id": 2072,  "slug": "tiburones-rojos-veracruz"},
    "atletico-celaya":     {"name": "Atlético Celaya",        "tm_id": None,  "slug": "atletico-celaya"},
}
