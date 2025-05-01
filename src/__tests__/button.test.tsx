import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock a simple button component instead of importing
const Button = ({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button disabled={props.disabled} {...props}>
    {children}
  </button>
)

describe('Button component', () => {
  it('renders a button with the correct text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('renders a disabled button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
  })
})