# Liga MX Quiz — Contexto del Proyecto

## Descripción
Sitio web de minijuegos de fútbol enfocado en Liga MX. Inspirado en sitios tipo Futbol 11.  
El primer juego es **"Adivina el XI"**: el usuario debe escribir los nombres de los 11 jugadores titulares de un partido real de Liga MX.

---

## Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 14.2.35 | Framework principal con App Router |
| TypeScript | ^5 | Tipado estático |
| Tailwind CSS | ^3.3.0 | Estilos |
| React | ^18.3.1 | UI |

**Datos:** mockeados en archivos `.ts` (plan futuro: migrar a Supabase)  
**Repositorio:** `AlvaroPad175/Actividadf-RETO`  
**Rama de desarrollo activa:** `claude/friendly-mayer-bQzla`

---

## Estructura del proyecto

```
/
├── app/
│   ├── layout.tsx                          # Root layout: Navbar + fuente Inter + fondo oscuro
│   ├── globals.css                         # Tailwind base + animación @keyframes shake
│   ├── page.tsx                            # Landing page
│   ├── games/
│   │   ├── page.tsx                        # Lista de juegos disponibles
│   │   └── guess-xi/
│   │       ├── page.tsx                    # Selección de partido para Adivina el XI
│   │       └── [matchId]/
│   │           └── page.tsx               # Juego completo (Client Component)
├── components/
│   ├── Navbar.tsx                          # Navbar sticky oscura
│   ├── GameCard.tsx                        # Tarjeta de partido (home vs away + score)
│   ├── GameHeader.tsx                      # Encabezado del juego con progreso y tabs
│   ├── LineupGrid.tsx                      # Grid visual de la alineación (estilo campo)
│   └── PlayerInput.tsx                     # Input individual por jugador
├── data/
│   └── matches.ts                          # Datos mockeados de partidos + getMatchById()
├── lib/
│   └── utils.ts                            # normalizeString + checkAnswer
├── types/
│   └── index.ts                            # Interfaces TypeScript
├── tailwind.config.ts                      # Config Tailwind + animación shake
├── postcss.config.js
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Tipos TypeScript (`types/index.ts`)

```typescript
interface Player {
  id: string
  name: string
  number: number
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
}

interface Team {
  id: string
  name: string
  shortName: string   // Ej: 'AME', 'GDL'
  color: string       // Color principal hex
  secondaryColor: string
}

interface Lineup {
  formation: string   // Ej: '4-3-3', '4-4-2', '4-2-3-1'
  players: Player[]   // 11 jugadores
}

interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeLineup: Lineup
  awayLineup: Lineup
  date: string
  competition: string
  stage: string
  score?: { home: number; away: number }
}
```

---

## Datos mockeados (`data/matches.ts`)

Tres clásicos de Liga MX Clausura 2024 con alineaciones completas:

| ID | Partido | Resultado | Formaciones |
|---|---|---|---|
| `clasico-nacional-2024` | Club América vs Chivas Guadalajara | 1-1 | 4-3-3 vs 4-3-3 |
| `clasico-capitalino-2024` | Cruz Azul vs Pumas UNAM | 2-0 | 4-4-2 vs 4-3-3 |
| `clasico-regio-2024` | Tigres UANL vs Rayados Monterrey | 3-2 | 4-2-3-1 vs 4-3-3 |

Colores de equipos:
- América: `#FFD700` / `#003087`
- Chivas: `#CC0000` / `#FFFFFF`
- Cruz Azul: `#0057A8` / `#FFFFFF`
- Pumas: `#FFD700` / `#000000`
- Tigres: `#FFD700` / `#003087`
- Rayados: `#0057A8` / `#FFFFFF`

Función helper exportada: `getMatchById(id: string): Match | undefined`

---

## Utilidades (`lib/utils.ts`)

```typescript
// Normaliza texto: minúsculas + sin acentos + sin espacios extra
normalizeString(str: string): string

// Compara guess contra nombre correcto ignorando mayúsculas/acentos/espacios
checkAnswer(guess: string, correctName: string): boolean
```

Maneja: `é→e`, `á→a`, `ó→o`, `ú→u`, `ñ→n`, espacios múltiples, mayúsculas.

---

## Componentes

### `Navbar.tsx`
- Sticky, `bg-gray-900`, borde inferior gris
- Logo: `⚽ Liga MX Quiz` en amarillo
- Links: Inicio, Juegos, botón CTA "Adivina el XI"

### `GameCard.tsx`
- Props: `match: Match`, `onClick: () => void`
- Muestra: badge de competición, fecha, escudos (iniciales coloreadas), marcador, botón "Jugar →"
- Hover: borde amarillo, `bg-gray-750`

### `GameHeader.tsx`
- Props: `match`, `selectedTeam: 'home' | 'away'`, `onSelectTeam`, `progress`, `total`
- Muestra: título del partido, formación del equipo seleccionado
- Tabs para cambiar entre equipo local/visitante
- Barra de progreso amarilla (X/11)

### `LineupGrid.tsx`
- Props: `lineup`, `guessedPlayers: Set<string>`, `revealedPlayers: Set<string>`, `onCorrectGuess`
- Parsea el string de formación (`'4-3-3'`) para dividir jugadores en filas
- Orden visual de arriba a abajo: FWD → MID → DEF → GK (estilo campo de fútbol)
- Cada fila usa CSS grid con columnas proporcionales al número de jugadores

### `PlayerInput.tsx`
- Props: `player`, `onCorrectGuess`, `revealed: boolean`, `isGuessed: boolean`
- Estados visuales:
  - **Normal:** `bg-gray-800 border-gray-700` + input activo
  - **Adivinado:** `bg-green-900/30 border-green-600/50` + nombre en verde + ✓
  - **Revelado:** `bg-red-900/20 border-red-700/40` + nombre en rojo
  - **Error:** flash rojo + animación `animate-shake` (400ms)
- Badge de posición con color por rol: GK=amarillo, DEF=azul, MID=verde, FWD=rojo
- Submit con Enter o botón OK
- Input se limpia tras cada intento (correcto o incorrecto)

---

## Lógica del juego (`app/games/guess-xi/[matchId]/page.tsx`)

- **Client Component** (`'use client'`)
- Estado por equipo (home/away independientes):
  - `homeGuessed / awayGuessed`: `Set<string>` de IDs adivinados
  - `homeRevealed / awayRevealed`: `Set<string>` de IDs revelados
- `selectedTeam`: alterna entre `'home'` y `'away'`
- Al completar un equipo (11/11): banner verde + opción de cambiar al otro equipo
- Al completar ambos equipos: banner de celebración + link "Jugar otro partido"
- Botón "Revelar todo": requiere confirmación → revela jugadores no adivinados en rojo
- Botón "Reiniciar equipo": limpia guessed y revealed del equipo actual
- Set spread usa `Array.from(prev).concat(id)` en lugar de `[...prev, id]` (fix de tsconfig target)

---

## Rutas disponibles

| URL | Página |
|---|---|
| `/` | Landing page con hero, stats y partidos destacados |
| `/games` | Lista de juegos (Adivina el XI disponible, 2 próximamente) |
| `/games/guess-xi` | Selección de partido |
| `/games/guess-xi/clasico-nacional-2024` | Jugar América vs Chivas |
| `/games/guess-xi/clasico-capitalino-2024` | Jugar Cruz Azul vs Pumas |
| `/games/guess-xi/clasico-regio-2024` | Jugar Tigres vs Rayados |

---

## Diseño

- **Fondo:** `bg-gray-950`
- **Tarjetas:** `bg-gray-800 border border-gray-700`
- **Acento principal:** `text-yellow-400` / `bg-yellow-400`
- **Texto secundario:** `text-gray-300` / `text-gray-400`
- **Éxito:** `text-green-400` / `bg-green-900/50`
- **Error:** `text-red-400` / `bg-red-900/20`
- **Botón primario:** `bg-yellow-400 text-gray-900 hover:bg-yellow-300`
- **Botón secundario:** `border border-gray-600 text-gray-300`
- Totalmente responsive (mobile-first)
- Fuente: Inter (Google Fonts)

---

## Cómo correr el proyecto

```bash
git clone https://github.com/AlvaroPad175/Actividadf-RETO.git
cd Actividadf-RETO
git checkout claude/friendly-mayer-bQzla
npm install
npm run dev
# Abrir http://localhost:3000
```

---

## Estado actual del MVP

- [x] Estructura del proyecto Next.js 14 con App Router
- [x] Landing page con hero, stats y partidos destacados
- [x] Página de selección de partido
- [x] Juego "Adivina el XI" funcional
- [x] 3 partidos mockeados con alineaciones completas
- [x] Validación de respuestas (sin distinción de mayúsculas/acentos/espacios)
- [x] Jugadores adivinados en verde, revelados en rojo
- [x] Contador de progreso X/11
- [x] Botón "Revelar todo" con confirmación
- [x] Estado de victoria por equipo y por partido completo
- [x] Diseño oscuro, moderno y responsive
- [x] Build limpio (`npm run build` exitoso)

---

## Próximos pasos sugeridos

1. **Migración a Supabase** — reemplazar `data/matches.ts` con queries a tabla `matches`
2. **Sistema de puntuación** — tiempo, intentos fallidos, racha
3. **Más partidos** — agregar más jornadas y temporadas
4. **Autenticación** — guardar progreso por usuario
5. **Más juegos** — "Adivina el equipo", "¿Quién marcó?", "Adivina el torneo"
6. **Animaciones** — Framer Motion para transiciones
7. **PWA** — soporte offline con service worker
