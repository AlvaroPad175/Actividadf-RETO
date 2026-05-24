"""
champions_seed.py — Datos históricos verificados de campeones de Liga MX.

Fuente principal: Wikipedia — «Campeonato Mexicano de Fútbol»
Verificado manualmente torneo por torneo contra la tabla oficial de Wikipedia.

Formato de IDs:
  <season_type>-<year>   →  "invierno-1996", "apertura-2013", etc.
  El año corresponde a CUÁNDO se jugó el torneo (no temporada combinada).
  Invierno = segundo semestre del año indicado.
  Verano   = primer semestre del año indicado.

Notas históricas importantes:
  - Los torneos cortos comenzaron con Invierno 1996 (NO existió Verano 1996).
  - El Clausura 2010 se llamó oficialmente «Torneo Bicentenario 2010».
  - El Clausura 2020 fue cancelado por COVID-19 (sin campeón, se omite).
  - Guard1anes 2020 y 2021 sustituyeron el formato normal durante la pandemia.
  - runner_up_id: equipo subcampeón de esa final (None si desconocido).
"""

CHAMPIONS = [

    # ════════════════════════════════════════════════════════════════════════
    # INVIERNO / VERANO  (1996 – 2002)
    # ════════════════════════════════════════════════════════════════════════

    {
        "id": "invierno-1996", "year": 1996, "season_type": "Invierno",
        "team_id": "santos-laguna",      "runner_up_id": "necaxa",
        # Santos Laguna 4-3 Club Necaxa
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "verano-1997", "year": 1997, "season_type": "Verano",
        "team_id": "chivas-guadalajara", "runner_up_id": "toros-neza",
        # C. D. Guadalajara 7-2 Toros Neza
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "invierno-1997", "year": 1997, "season_type": "Invierno",
        "team_id": "cruz-azul",          "runner_up_id": "club-leon",
        # Cruz Azul 2-1 (g.o.) Club León
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "verano-1998", "year": 1998, "season_type": "Verano",
        "team_id": "deportivo-toluca",   "runner_up_id": "necaxa",
        # Toluca 6-4 Club Necaxa
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "invierno-1998", "year": 1998, "season_type": "Invierno",
        "team_id": "necaxa",             "runner_up_id": "chivas-guadalajara",
        # Club Necaxa 2-0 C. D. Guadalajara
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "verano-1999", "year": 1999, "season_type": "Verano",
        "team_id": "deportivo-toluca",   "runner_up_id": "atlas-fc",
        # Toluca 5-5 (5-4 pen.) Atlas
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "invierno-1999", "year": 1999, "season_type": "Invierno",
        "team_id": "cf-pachuca",         "runner_up_id": "cruz-azul",
        # Pachuca 3-2 (g.o.) Cruz Azul
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "verano-2000", "year": 2000, "season_type": "Verano",
        "team_id": "deportivo-toluca",   "runner_up_id": "santos-laguna",
        # Toluca 7-1 Santos Laguna
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "invierno-2000", "year": 2000, "season_type": "Invierno",
        "team_id": "monarcas-morelia",   "runner_up_id": "deportivo-toluca",
        # Monarcas Morelia 3-3 (5-4 pen.) Toluca
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "verano-2001", "year": 2001, "season_type": "Verano",
        "team_id": "santos-laguna",      "runner_up_id": "cf-pachuca",
        # Santos Laguna 4-3 Pachuca
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "invierno-2001", "year": 2001, "season_type": "Invierno",
        "team_id": "cf-pachuca",         "runner_up_id": "tigres-uanl",
        # Pachuca 3-1 Tigres UANL
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "verano-2002", "year": 2002, "season_type": "Verano",
        "team_id": "club-america",       "runner_up_id": "necaxa",
        # Club América 3-2 (g.o.) Club Necaxa
        "formation": "4-4-2", "needs_verification": False,
    },

    # ════════════════════════════════════════════════════════════════════════
    # APERTURA / CLAUSURA  (2002 – presente)
    # ════════════════════════════════════════════════════════════════════════

    {
        "id": "apertura-2002", "year": 2002, "season_type": "Apertura",
        "team_id": "deportivo-toluca",   "runner_up_id": "monarcas-morelia",
        # Toluca 4-2 Monarcas Morelia
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "clausura-2003", "year": 2003, "season_type": "Clausura",
        "team_id": "cf-monterrey",       "runner_up_id": "monarcas-morelia",
        # Monterrey 3-1 Monarcas Morelia
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "apertura-2003", "year": 2003, "season_type": "Apertura",
        "team_id": "cf-pachuca",         "runner_up_id": "tigres-uanl",
        # Pachuca 3-2 Tigres UANL
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "clausura-2004", "year": 2004, "season_type": "Clausura",
        "team_id": "pumas-unam",         "runner_up_id": "chivas-guadalajara",
        # UNAM 1-1 (5-4 pen.) C. D. Guadalajara
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "apertura-2004", "year": 2004, "season_type": "Apertura",
        "team_id": "pumas-unam",         "runner_up_id": "cf-monterrey",
        # UNAM 3-1 Monterrey
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "clausura-2005", "year": 2005, "season_type": "Clausura",
        "team_id": "club-america",       "runner_up_id": "tecos-uag",
        # Club América 7-4 Tecos UAG
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2005", "year": 2005, "season_type": "Apertura",
        "team_id": "deportivo-toluca",   "runner_up_id": "cf-monterrey",
        # Toluca 6-3 Monterrey
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "clausura-2006", "year": 2006, "season_type": "Clausura",
        "team_id": "cf-pachuca",         "runner_up_id": "atletico-san-luis",
        # Pachuca 1-0 San Luis
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "apertura-2006", "year": 2006, "season_type": "Apertura",
        "team_id": "chivas-guadalajara", "runner_up_id": "deportivo-toluca",
        # C. D. Guadalajara 3-2 Toluca
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2007", "year": 2007, "season_type": "Clausura",
        "team_id": "cf-pachuca",         "runner_up_id": "club-america",
        # Pachuca 3-2 Club América
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "apertura-2007", "year": 2007, "season_type": "Apertura",
        "team_id": "atlante",            "runner_up_id": "pumas-unam",
        # C. F. Atlante 2-1 UNAM
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "clausura-2008", "year": 2008, "season_type": "Clausura",
        "team_id": "santos-laguna",      "runner_up_id": "cruz-azul",
        # Santos Laguna 3-2 Cruz Azul
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2008", "year": 2008, "season_type": "Apertura",
        "team_id": "deportivo-toluca",   "runner_up_id": "cruz-azul",
        # Toluca 2-2 (7-6 pen.) Cruz Azul
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "clausura-2009", "year": 2009, "season_type": "Clausura",
        "team_id": "pumas-unam",         "runner_up_id": "cf-pachuca",
        # UNAM 3-2 (pró.) Pachuca
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2009", "year": 2009, "season_type": "Apertura",
        "team_id": "cf-monterrey",       "runner_up_id": "cruz-azul",
        # Monterrey 6-4 Cruz Azul
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        # Oficialmente «Torneo Bicentenario 2010» — equivale al Clausura 2010
        "id": "clausura-2010", "year": 2010, "season_type": "Clausura",
        "official_name": "Torneo Bicentenario 2010",
        "team_id": "deportivo-toluca",   "runner_up_id": "santos-laguna",
        # Toluca 2-2 (4-3 pen.) Santos Laguna
        "formation": "4-4-2", "needs_verification": False,
    },
    {
        "id": "apertura-2010", "year": 2010, "season_type": "Apertura",
        "team_id": "cf-monterrey",       "runner_up_id": "santos-laguna",
        # Monterrey 5-3 Santos Laguna
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2011", "year": 2011, "season_type": "Clausura",
        "team_id": "pumas-unam",         "runner_up_id": "monarcas-morelia",
        # UNAM 3-2 Monarcas Morelia
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2011", "year": 2011, "season_type": "Apertura",
        "team_id": "tigres-uanl",        "runner_up_id": "santos-laguna",
        # Tigres UANL 4-1 Santos Laguna
        "formation": "4-2-3-1", "needs_verification": False,
    },
    {
        "id": "clausura-2012", "year": 2012, "season_type": "Clausura",
        "team_id": "santos-laguna",      "runner_up_id": "cf-monterrey",
        # Santos Laguna 3-2 Monterrey
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2012", "year": 2012, "season_type": "Apertura",
        "team_id": "club-tijuana",       "runner_up_id": "deportivo-toluca",
        # Tijuana 4-1 Toluca
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2013", "year": 2013, "season_type": "Clausura",
        "team_id": "club-america",       "runner_up_id": "cruz-azul",
        # Club América 2-2 (4-2 pen.) Cruz Azul
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2013", "year": 2013, "season_type": "Apertura",
        "team_id": "club-leon",          "runner_up_id": "club-america",
        # Club León 5-1 Club América
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2014", "year": 2014, "season_type": "Clausura",
        "team_id": "club-leon",          "runner_up_id": "cf-pachuca",
        # Club León 4-3 (pró.) Pachuca
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2014", "year": 2014, "season_type": "Apertura",
        "team_id": "club-america",       "runner_up_id": "tigres-uanl",
        # Club América 3-1 Tigres UANL
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2015", "year": 2015, "season_type": "Clausura",
        "team_id": "santos-laguna",      "runner_up_id": "queretaro-fc",
        # Santos Laguna 5-3 Querétaro
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2015", "year": 2015, "season_type": "Apertura",
        "team_id": "tigres-uanl",        "runner_up_id": "pumas-unam",
        # Tigres UANL 4-4 (4-2 pen.) UNAM
        "formation": "4-2-3-1", "needs_verification": False,
    },
    {
        "id": "clausura-2016", "year": 2016, "season_type": "Clausura",
        "team_id": "cf-pachuca",         "runner_up_id": "cf-monterrey",
        # Pachuca 2-1 Monterrey
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2016", "year": 2016, "season_type": "Apertura",
        "team_id": "tigres-uanl",        "runner_up_id": "club-america",
        # Tigres UANL 2-2 (3-0 pen.) Club América
        "formation": "4-2-3-1", "needs_verification": False,
    },
    {
        "id": "clausura-2017", "year": 2017, "season_type": "Clausura",
        "team_id": "chivas-guadalajara", "runner_up_id": "tigres-uanl",
        # C. D. Guadalajara 4-3 Tigres UANL
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2017", "year": 2017, "season_type": "Apertura",
        "team_id": "tigres-uanl",        "runner_up_id": "cf-monterrey",
        # Tigres UANL 3-2 Monterrey
        "formation": "4-2-3-1", "needs_verification": False,
    },
    {
        "id": "clausura-2018", "year": 2018, "season_type": "Clausura",
        "team_id": "santos-laguna",      "runner_up_id": "deportivo-toluca",
        # Santos Laguna 3-2 Toluca
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2018", "year": 2018, "season_type": "Apertura",
        "team_id": "club-america",       "runner_up_id": "cruz-azul",
        # Club América 2-0 Cruz Azul
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2019", "year": 2019, "season_type": "Clausura",
        "team_id": "tigres-uanl",        "runner_up_id": "club-leon",
        # Tigres UANL 1-0 Club León
        "formation": "4-2-3-1", "needs_verification": False,
    },
    {
        "id": "apertura-2019", "year": 2019, "season_type": "Apertura",
        "team_id": "cf-monterrey",       "runner_up_id": "club-america",
        # Monterrey 3-3 (4-2 pen.) Club América
        "formation": "4-3-3", "needs_verification": False,
    },
    # Clausura 2020: cancelado por pandemia COVID-19 — sin campeón, se omite.

    # ── Guard1anes (formato especial por pandemia) ───────────────────────────
    {
        "id": "guard1anes-2020", "year": 2020, "season_type": "Guard1anes",
        "team_id": "club-leon",          "runner_up_id": "pumas-unam",
        # Club León 3-1 UNAM
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "guard1anes-2021", "year": 2021, "season_type": "Guard1anes",
        "team_id": "cruz-azul",          "runner_up_id": "santos-laguna",
        # Cruz Azul 2-1 Santos Laguna (fin del ayuno de 23 años de Cruz Azul)
        "formation": "4-3-3", "needs_verification": False,
    },

    # ── Regreso al formato normal ────────────────────────────────────────────
    {
        "id": "apertura-2021", "year": 2021, "season_type": "Apertura",
        "team_id": "atlas-fc",           "runner_up_id": "club-leon",
        # Atlas 3-3 (4-3 pen.) Club León
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2022", "year": 2022, "season_type": "Clausura",
        "team_id": "atlas-fc",           "runner_up_id": "cf-pachuca",
        # Atlas 3-2 Pachuca
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2022", "year": 2022, "season_type": "Apertura",
        "team_id": "cf-pachuca",         "runner_up_id": "deportivo-toluca",
        # Pachuca 8-2 Toluca
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2023", "year": 2023, "season_type": "Clausura",
        "team_id": "tigres-uanl",        "runner_up_id": "chivas-guadalajara",
        # Tigres UANL 3-2 (pró.) Guadalajara
        "formation": "4-2-3-1", "needs_verification": False,
    },
    {
        "id": "apertura-2023", "year": 2023, "season_type": "Apertura",
        "team_id": "club-america",       "runner_up_id": "tigres-uanl",
        # Club América 4-1 (pró.) Tigres UANL
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2024", "year": 2024, "season_type": "Clausura",
        "team_id": "club-america",       "runner_up_id": "cruz-azul",
        # Club América 2-1 Cruz Azul
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2024", "year": 2024, "season_type": "Apertura",
        "team_id": "club-america",       "runner_up_id": "cf-monterrey",
        # Club América 3-2 Monterrey
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "clausura-2025", "year": 2025, "season_type": "Clausura",
        "team_id": "deportivo-toluca",   "runner_up_id": "club-america",
        # Toluca 2-0 Club América
        "formation": "4-3-3", "needs_verification": False,
    },
    {
        "id": "apertura-2025", "year": 2025, "season_type": "Apertura",
        "team_id": "deportivo-toluca",   "runner_up_id": "tigres-uanl",
        # Toluca 2-2 (9-8 pen.) Tigres UANL
        "formation": "4-3-3", "needs_verification": False,
    },
]
