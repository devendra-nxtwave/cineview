import { render, screen } from '@testing-library/react'
import { HomePage } from './HomePage'

vi.mock('../../../data/hooks/useHomePageData', () => ({
  useHomePageData: () => ({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    genres: [],
    isLoading: false,
    error: null,
  }),
}))

describe('HomePage', () => {
  it('renders content row headings', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /trending/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /popular/i })).toBeInTheDocument()
  })
})