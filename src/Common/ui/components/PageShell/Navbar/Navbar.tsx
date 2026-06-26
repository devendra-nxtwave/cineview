import { NavLink } from 'react-router-dom'

type NavbarProps = {
  username: string
  onLogout: () => void
}

export function Navbar({ username, onLogout }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo" end>
          CineView
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/watchlist">Watchlist</NavLink>
          <NavLink to="/lists">My Lists</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </div>

      <div className="navbar-right">
        <input
          className="navbar-search"
          type="search"
          placeholder="Search movies, shows…"
          aria-label="Search"
          readOnly
        />

        <span className="navbar-lang" aria-label="Language switcher">
          EN
        </span>

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