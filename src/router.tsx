import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from './Auth'
import { NotFoundPage } from './Common'
import { WatchlistPage, MyListsPage, ListDetailPage } from './Collection'
import { HomePage, MovieDetailPage } from './Movies'
import { SettingsPage } from './Preferences'
import { SearchPage } from './Search'
import { TVShowDetailPage, SeasonDetailPage } from './TVShows'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <HomePage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/movies/:movieId', element: <MovieDetailPage /> },
  { path: '/tv/:showId', element: <TVShowDetailPage /> },
  { path: '/tv/:showId/season/:seasonNumber', element: <SeasonDetailPage /> },
  { path: '/watchlist', element: <WatchlistPage /> },
  { path: '/lists', element: <MyListsPage /> },
  { path: '/lists/:listId', element: <ListDetailPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '*', element: <NotFoundPage /> },
])