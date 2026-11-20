import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { criteria, presentationCriteria } from './rubric'
import './index.css'

const coachesKit = 'https://ethicsolympiad.org/2026MiddleSchoolEthicsOlympiad/2026ETHICSOLYMPIADCOACHESONLINEMSKIT.pdf'
const studentsKit = 'https://ethicsolympiad.org/2026MiddleSchoolEthicsOlympiad/2026ETHICSOLYMPIADSTUDENTSONLINEMSKIT.pdf'
const teams = ['A', 'B'] as const
const otherCriteria = criteria.slice(presentationCriteria.length)
const linkClass = 'text-amber-300 underline decoration-amber-400/40 underline-offset-4 hover:text-amber-200'
const fieldClass = 'rounded-md border border-slate-700 bg-slate-950 py-2 text-sm text-slate-100 focus:border-amber-300 focus:outline-none'

type Team = typeof teams[number]
type Criterion = typeof criteria[number]
type TeamScores = Partial<Record<Criterion['id'], number>>

function sumScores(teamScores: TeamScores, rows: readonly Criterion[]) {
  return rows.reduce((total, { id }) => total + (teamScores[id] ?? 0), 0)
}

function ScoreSheet() {
  const [scores, setScores] = useState<Record<Team, TeamScores>>({ A: {}, B: {} })

  function renderScoreRow({ id, label, max }: Criterion) {
    return (
      <tr key={id} className="border-t border-slate-800">
        <th scope="row" className="px-3 py-3 text-left font-medium sm:px-5">
          <a href={`#rubric-${id}`} className={linkClass}>{label}</a>
          <span className="ml-1 whitespace-nowrap text-xs text-slate-400">/ {max}</span>
        </th>
        {teams.map(team => (
          <td key={team} className="px-1 py-2 text-center sm:px-3">
            <select
              aria-label={`Team ${team} ${label}`}
              className={`${fieldClass} w-full max-w-20 px-1 tabular-nums sm:px-2`}
              value={scores[team][id] ?? ''}
              onChange={event => {
                const value = event.target.value
                setScores(current => ({
                  ...current,
                  [team]: { ...current[team], [id]: value ? Number(value) : undefined },
                }))
              }}
            >
              <option value="">—</option>
              {Array.from({ length: max }, (_, index) => index + 1).map(score => (
                <option key={score} value={score}>{score}</option>
              ))}
            </select>
          </td>
        ))}
      </tr>
    )
  }

  return (
    <section id="score-sheet" aria-labelledby="score-heading" className="scroll-mt-6">
      <h2 id="score-heading" className="text-2xl font-bold text-white">Score sheet</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
        Each team presents one case and comments on the other. Score respectful dialogue across both cases. Select a criterion to see its scoring guidance.
      </p>
      <form autoComplete="off" onSubmit={event => event.preventDefault()} className="mt-5 grid gap-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1.5 text-sm font-medium text-cyan-300">
            Team A name <input type="text" className={`${fieldClass} w-full px-3`} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-rose-300">
            Team B name <input type="text" className={`${fieldClass} w-full px-3`} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-300">
            Judge name <input type="text" className={`${fieldClass} w-full px-3`} />
          </label>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60">
          <table aria-label="Scores by team and criterion" className="w-full text-sm">
            <thead>
              <tr>
                <th scope="col" className="px-3 py-3 text-left sm:px-5">Criterion</th>
                <th scope="col" className="w-17 px-1 py-3 text-cyan-300 sm:w-28">Team A</th>
                <th scope="col" className="w-17 px-1 py-3 text-rose-300 sm:w-28">Team B</th>
              </tr>
            </thead>
            <tbody>
              {presentationCriteria.map(renderScoreRow)}
              <tr className="border-t border-slate-800 bg-slate-800/30 text-slate-300">
                <th scope="row" className="px-3 py-2 text-left font-medium sm:px-5">Presentation subtotal</th>
                {teams.map(team => (
                  <td key={team} className="px-1 py-2 text-center tabular-nums">
                    <output aria-label={`Team ${team} presentation subtotal`}>{sumScores(scores[team], presentationCriteria) || '—'} / 15</output>
                  </td>
                ))}
              </tr>
              {otherCriteria.map(renderScoreRow)}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-700 font-semibold">
                <th scope="row" className="px-3 py-3 text-left sm:px-5">Running total</th>
                {teams.map(team => (
                  <td key={team} className="whitespace-nowrap px-1 py-3 text-center text-amber-300 tabular-nums">
                    <output aria-label={`Team ${team} running total`}>{sumScores(scores[team], criteria) || '—'} / 60</output>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {teams.map(team => (
            <label key={team} className="grid gap-1.5 text-sm font-medium text-slate-300">
              Comments for Team {team}
              <textarea rows={3} className={`${fieldClass} w-full px-3`} />
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-400">Entries are cleared when you reload or close this tab.</p>
      </form>
    </section>
  )
}

function RubricPage() {
  return (
    <div className="min-h-screen bg-[#0b0f18] font-sans text-slate-100 scheme-dark">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
        <header className="mb-8 border-b border-slate-800 pb-7">
          <p className="font-mono text-xs tracking-wider text-amber-300 uppercase">2026 Middle School Ethics Olympiad</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Scoring rubric &amp; score sheet</h1>
          <nav aria-label="Page sections" className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a className={linkClass} href="#score-sheet">Fill in the score sheet</a>
            <a className={linkClass} href="#rubric">View the rubric</a>
          </nav>
        </header>

        <ScoreSheet />

        <section id="rubric" aria-labelledby="rubric-heading" className="mt-12 scroll-mt-6 border-t border-slate-800 pt-8">
          <h2 id="rubric-heading" className="text-2xl font-bold text-white">Scoring rubric</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Use these judge prompts to apply the published scoring bands. Look for teams to build on each other’s reasoning as they work through the case. A heat is worth 60 points per team.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a className={linkClass} href={coachesKit} target="_blank" rel="noopener noreferrer">Published coach kit ↗</a>
            <a className={linkClass} href={studentsKit} target="_blank" rel="noopener noreferrer">Published student kit and score sheet ↗</a>
            <a className={linkClass} href="#score-sheet">Back to score sheet</a>
          </p>

          <div className="mt-6 grid gap-4">
            {criteria.map(({ id, label, max, question, bands }) => (
              <article key={id} id={`rubric-${id}`} className="scroll-mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 target:border-amber-300/70 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-semibold text-white">{label}</h3>
                  <span className="font-mono text-xs text-amber-300">{max} points</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{question}</p>
                <dl className="mt-4 text-sm leading-relaxed">
                  {bands.map(([range, prompt]) => (
                    <div key={range} className="grid grid-cols-[4rem_1fr] gap-3 border-t border-slate-800 py-2">
                      <dt className="font-mono font-medium text-amber-300">{range}</dt>
                      <dd>{prompt}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RubricPage />
  </React.StrictMode>,
)
