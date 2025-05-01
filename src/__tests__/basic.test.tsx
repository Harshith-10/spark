import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple test suite
describe('Basic tests', () => {
  // Basic rendering test
  it('renders a heading', () => {
    render(<h1>Hello World</h1>)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Hello World')
  })

  // Simple true/false test
  it('basic truth test', () => {
    expect(true).toBe(true)
    expect(false).not.toBe(true)
  })

  // Simple math test
  it('basic math test', () => {
    expect(1 + 1).toBe(2)
    expect(5 - 2).toBe(3)
  })
})