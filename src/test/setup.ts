import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { expect, afterEach } from 'vitest'

// Cleanup after each test case
afterEach(() => {
  cleanup()
})
