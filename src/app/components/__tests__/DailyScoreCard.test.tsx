import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { DailyScoreCard } from '../DailyScoreCard'

describe('DailyScoreCard', () => {
  it('renders score correctly', () => {
    render(
      <DailyScoreCard
        change={2.5}
        mood="bullish"
        score={75}
        summary="Market is performing well"
      />
    )

    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('/100')).toBeInTheDocument()
  })

  it('displays positive change correctly', () => {
    render(
      <DailyScoreCard
        change={3.2}
        mood="bullish"
        score={80}
        summary="Strong upward trend"
      />
    )

    expect(screen.getByText(/\+3\.2%/)).toBeInTheDocument()
  })

  it('displays negative change correctly', () => {
    render(
      <DailyScoreCard
        change={-1.5}
        mood="bearish"
        score={45}
        summary="Market pullback"
      />
    )

    expect(screen.getByText(/-1\.5%/)).toBeInTheDocument()
  })

  it('renders mood indicator', () => {
    render(
      <DailyScoreCard
        change={0}
        mood="neutral"
        score={60}
        summary="Sideways movement"
      />
    )

    expect(screen.getByText('neutral')).toBeInTheDocument()
  })

  it('displays summary text', () => {
    const summary = 'Market shows strong momentum'
    render(
      <DailyScoreCard
        change={4.1}
        mood="bullish"
        score={85}
        summary={summary}
      />
    )

    expect(screen.getByText(summary)).toBeInTheDocument()
  })
})
