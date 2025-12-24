import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DailyScoreCard } from '../DailyScoreCard'

describe('DailyScoreCard', () => {
  it('renders score correctly', () => {
    render(
      <DailyScoreCard
        score={75}
        change={2.5}
        mood="bullish"
        summary="Market is performing well"
      />
    )

    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('/100')).toBeInTheDocument()
  })

  it('displays positive change correctly', () => {
    render(
      <DailyScoreCard
        score={80}
        change={3.2}
        mood="bullish"
        summary="Strong upward trend"
      />
    )

    expect(screen.getByText(/\+3\.2%/)).toBeInTheDocument()
  })

  it('displays negative change correctly', () => {
    render(
      <DailyScoreCard
        score={45}
        change={-1.5}
        mood="bearish"
        summary="Market pullback"
      />
    )

    expect(screen.getByText(/-1\.5%/)).toBeInTheDocument()
  })

  it('renders mood indicator', () => {
    render(
      <DailyScoreCard
        score={60}
        change={0}
        mood="neutral"
        summary="Sideways movement"
      />
    )

    expect(screen.getByText('neutral')).toBeInTheDocument()
  })

  it('displays summary text', () => {
    const summary = 'Market shows strong momentum'
    render(
      <DailyScoreCard
        score={85}
        change={4.1}
        mood="bullish"
        summary={summary}
      />
    )

    expect(screen.getByText(summary)).toBeInTheDocument()
  })
})
