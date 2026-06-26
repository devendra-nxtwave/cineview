import { render, screen } from '@testing-library/react'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the home page title', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { name: /home page/i }),
    ).toBeInTheDocument()
  })
})