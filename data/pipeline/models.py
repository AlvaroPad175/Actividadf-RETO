"""
models.py — Data models for Liga MX Champions pipeline.
Uses Python dataclasses (stdlib only).
"""
from dataclasses import dataclass, field
from typing import Optional, List
from enum import Enum


class SeasonType(str, Enum):
    VERANO = "Verano"
    INVIERNO = "Invierno"
    APERTURA = "Apertura"
    CLAUSURA = "Clausura"
    GUARD1ANES = "Guard1anes"  # COVID 2020 special edition


class PositionGroup(str, Enum):
    GK = "GK"
    DEF = "DEF"
    MID = "MID"
    FWD = "FWD"


@dataclass
class Team:
    id: str                        # slug: "club-america"
    name: str                      # "Club América"
    tm_id: Optional[int]           # Transfermarkt numeric ID
    tm_slug: Optional[str]         # TM URL slug
    logo_url: Optional[str] = None


@dataclass
class Player:
    id: str                        # "necaxa-1996-christian-martinez" or tm_id str
    name: str
    nationality: Optional[str]
    preferred_position: Optional[str]     # position_exact like "CB"
    tm_id: Optional[int] = None


@dataclass
class LineupEntry:
    tournament_id: str
    team_id: str
    player_id: str
    shirt_number: Optional[int]
    position_group: str            # GK DEF MID FWD
    position_exact: Optional[str]  # CB RB LB CDM CAM ST etc.
    formation_order: int           # 1=GK, 2-5=DEF, etc.
    starter: bool = True


@dataclass
class Tournament:
    id: str                        # "apertura-2013"
    year: int
    season_type: str               # SeasonType value
    champion_team_id: str
    formation: Optional[str]       # "4-3-3"
    runner_up_team_id: Optional[str] = None
    source: str = "scraped"        # "scraped" | "manual" | "seed"
    needs_verification: bool = False
