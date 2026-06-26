import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { type FormEvent, useState } from 'react'

type NavbarProps = {
  username: string
  onLogout: () => void
}

export function Navbar({ username, onLogout }: NavbarProps) {
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
          CineView
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/watchlist">Watchlist</NavLink>
          <NavLink to="/lists">My Lists</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </div>

      <div className="navbar-right">
        <form onSubmit={handleSearchSubmit}>
          <input
            className="navbar-search"
            type="search"
            placeholder="Search movies, shows…"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <span className="navbar-lang" aria-label="Language switcher">EN</span>

        <span className="navbar-avatar" aria-label="User avatar">
          {username.charAt(0).toUpperCase()}
        </span>

        <button type="button" className="navbar-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}