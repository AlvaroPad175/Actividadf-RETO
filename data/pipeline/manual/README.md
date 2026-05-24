# Manual Lineup Overrides

This file explains how to add or edit manual lineup entries in `lineups_override.json` without breaking the database.

## When to use manual overrides

- Transfermarkt does not have squad data for older seasons (pre-2005)
- Scraping is blocked and Selenium is not available
- You have authoritative lineup data from a primary source (official Liga MX records, match reports, etc.)
- You want to correct incorrect data that was scraped

## File format

```json
{
  "_comment": "Do not remove this key — it is a metadata comment and will be ignored by the pipeline.",
  "<tournament-id>": {
    "team_id": "<team-slug>",
    "formation": "<formation-string>",
    "source": "manual",
    "players": [
      {
        "name":            "<Full player name>",
        "shirt_number":    <integer or null>,
        "position_group":  "<GK|DEF|MID|FWD>",
        "position_exact":  "<GK|CB|RB|LB|RWB|LWB|CDM|CM|CAM|RM|LM|RW|LW|SS|ST|CF>",
        "formation_order": <1-11 for starters, 12+ for bench>,
        "starter":         <true or false>,
        "nationality":     "<Country name or null>",
        "tm_id":           <integer Transfermarkt ID, or omit>
      }
    ]
  }
}
```

## Field definitions

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | Yes | Full name as it appears in official records |
| `shirt_number` | integer | No | Jersey number; use `null` if unknown |
| `position_group` | string | Yes | One of: `GK`, `DEF`, `MID`, `FWD` |
| `position_exact` | string | No | Specific position code (see list above) |
| `formation_order` | integer | Yes | 1=GK, 2-N=starters in formation order, >11=bench |
| `starter` | boolean | No | Defaults to `true` |
| `nationality` | string | No | Country name in English |
| `tm_id` | integer | No | Transfermarkt player ID if known; used for deduplication |

## Tournament ID format

Tournament IDs follow the pattern `<season_type>-<year>` using lowercase:

- `verano-1996`, `invierno-1998`
- `apertura-2013`, `clausura-2014`
- `guard1anes-2020`

## Deduplication behavior

Players are deduplicated by `tm_id` if provided, otherwise by the generated ID `<team_id>-<year>-<slugified-name>`. Providing `tm_id` ensures the same player appearing in multiple seasons maps to the same database record.

## Safety guarantees

1. Entries in this file **always take precedence** over scraped data for the same tournament ID.
2. The pipeline uses `INSERT OR REPLACE` in SQLite, so re-running the pipeline with updated overrides will update existing records safely.
3. Keys beginning with `_` (like `_comment`) are ignored by the parser.
4. A missing or empty `players` list will result in no lineup entries for that tournament — the tournament record itself is still written from seed data.

## Example: adding Verano 1996 (Necaxa)

```json
"verano-1996": {
  "team_id": "necaxa",
  "formation": "4-4-2",
  "source": "manual",
  "players": [
    {"name": "Adolfo Rios",      "shirt_number": 1,  "position_group": "GK",  "position_exact": "GK",  "formation_order": 1},
    {"name": "Mario Mendez",     "shirt_number": 2,  "position_group": "DEF", "position_exact": "RB",  "formation_order": 2},
    {"name": "Luis Perez",       "shirt_number": 5,  "position_group": "DEF", "position_exact": "CB",  "formation_order": 3},
    ...
  ]
}
```
