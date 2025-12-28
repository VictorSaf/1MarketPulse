import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { QuickPulse } from '../QuickPulse'

describe('QuickPulse', () => {
  it('renders component title', () => {
    render(<QuickPulse />)
    expect(screen.getByText('Quick Pulse')).toBeInTheDocument()
  })

  it('displays all metric cards', () => {
    render(<QuickPulse />)

    expect(screen.getByText('Market Trend')).toBeInTheDocument()
    expect(screen.getByText('Volatility')).toBeInTheDocument()
    expect(screen.getByText('Sentiment')).toBeInTheDocument()
    expect(screen.getByText('Volume')).toBeInTheDocument()
  })

  it('shows metric values', () => {
    render(<QuickPulse />)

    expect(screen.getByText('Bullish')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Greedy')).toBeInTheDocument()
    expect(screen.getByText('Above Avg')).toBeInTheDocument()
  })

  it('displays metric changes', () => {
    render(<QuickPulse />)

    expect(screen.getByText('+2.3%')).toBeInTheDocument()
    expect(screen.getByText('VIX: 14.2')).toBeInTheDocument()
    expect(screen.getByText('72/100')).toBeInTheDocument()
    expect(screen.getByText('+15%')).toBeInTheDocument()
  })
})
