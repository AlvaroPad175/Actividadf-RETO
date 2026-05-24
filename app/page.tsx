'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { matches } from '@/data/matches'
import GameCard from '@/components/GameCard'
import { Match } from '@/types'

const STATS = [
  { value: String(matches.length), label: 'Partidos disponibles' },
  { value: String(matches.reduce((n, m) => n + m.homeLineup.players.length + m.awayLineup.players.length, 0)), label: 'Jugadores para adivinar' },
  { value: String(new Set(matches.flatMap(m => [m.homeTeam.id, m.awayTeam.id])).size), label: 'Equipos incluidos' },
]

const STEPS = [
  { n: '1', title: 'Elige un partido', desc: 'Selecciona uno de los clásicos disponibles de la Liga MX.' },
  { n: '2', title: 'Adivina los jugadores', desc: 'Escribe el nombre de cada jugador del XI titular.' },
  { n: '3', title: 'Completa el XI', desc: 'Intenta adivinar los 11 antes de rendirte. ¡Puedes omitir acentos!' },
]

export default function HomePage() {
  const router = useRouter()

  const handleMatchClick = (match: Match) => {
    router.push(`/games/guess-xi/${match.id}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background glows */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="max-w-2xl animate-fade-up">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-semibold"
              style={{
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.25)',
                color: '#FFD700',
              }}
            >
              ⚽ Temporada 2024
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              Liga MX<br />
              <span style={{ color: '#FFD700' }}>Quiz</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Pon a prueba tu conocimiento del fútbol mexicano.<br className="hidden sm:block" />
              Adivina los jugadores de los clásicos más memorables.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/games/guess-xi"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: '#FFD700', color: '#000' }}
              >
                Jugar Ahora →
              </Link>
              <Link
                href="/games"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-base transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Ver todos los juegos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(13,18,32,0.6)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-3 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-black" style={{ color: '#FFD700' }}>{value}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured matches ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Partidos Destacados</h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Los clásicos más importantes de la Liga MX
            </p>
          </div>
          <Link
            href="/games/guess-xi"
            className="text-sm font-semibold transition-colors"
            style={{ color: '#FFD700' }}
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.slice(0, 3).map((match) => (
            <GameCard key={match.id} match={match} onClick={handleMatchClick} />
          ))}
        </div>
      </section>

      {/* ── How to play ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(13,18,32,0.8)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h2 className="text-xl font-black text-white mb-6 tracking-tight">¿Cómo jugar Adivina el XI?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                  style={{
                    background: 'rgba(255,215,0,0.1)',
                    border: '1px solid rgba(255,215,0,0.25)',
                    color: '#FFD700',
                  }}
                >
                  {n}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
