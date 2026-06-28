import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../Preferences/data/i18n/i18n'
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

function renderHomePage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <HomePage />
    </I18nextProvider>,
  )
}

describe('HomePage', () => {
  it('renders content row headings', () => {
    renderHomePage()
    expect(screen.getByRole('heading', { name: /trending/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /popular/i })).toBeInTheDocument()
  })
})