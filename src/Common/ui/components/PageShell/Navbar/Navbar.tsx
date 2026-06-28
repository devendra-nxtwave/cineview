import { type FormEvent, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { WatchlistBadge } from '../../../../../Collection'
import { LanguageSwitcher, preferencesStore, SUPPORTED_LOCALES } from '../../../../../Preferences'

type NavbarProps = {
  username: string
  onLogout: () => void
}

export const Navbar = observer(function Navbar({ username, onLogout }: NavbarProps) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo" end>
          {t('appName')}
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" end>{t('nav.home')}</NavLink>
          <NavLink to="/watchlist" className="navbar-watchlist-link">
            {t('nav.watchlist')}
            <WatchlistBadge />
          </NavLink>
          <NavLink to="/lists">{t('nav.lists')}</NavLink>
          <NavLink to="/settings">{t('nav.settings')}</NavLink>
        </nav>
      </div>

      <div className="navbar-right">
        <form onSubmit={handleSearchSubmit}>
          <input
            className="navbar-search"
            type="search"
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchAria')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <LanguageSwitcher
          value={preferencesStore.language}
          options={SUPPORTED_LOCALES}
          onChange={(code) => preferencesStore.setLanguage(code)}
        />

        <span className="navbar-avatar" aria-label="User avatar">
          {username.charAt(0).toUpperCase()}
        </span>

        <button type="button" className="navbar-logout" onClick={onLogout}>
          {t('logout')}
        </button>
      </div>
    </header>
  )
})