import { createBrowserRouter } from 'react-router-dom'
import { AppLayout, LoginPage, ProtectedRoute } from './Auth'
import { NotFoundPage } from './Common'
import { WatchlistPage, MyListsPage, ListDetailPage } from './Collection'
import { HomePage, MovieDetailPage } from './Movies'
import { SettingsPage } from './Preferences'
import { SearchPage } from './Search'
import { TVShowLayout, TVShowDetailPage, SeasonDetailPage } from './TVShows'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/search', element: <SearchPage /> },
          { path: '/movies/:movieId', element: <MovieDetailPage /> },
          {
            path: '/tv/:showId',
            element: <TVShowLayout />,
            children: [
              { index: true, element: <TVShowDetailPage /> },
              { path: 'season/:seasonNumber', element: <SeasonDetailPage /> },
            ],
          },
          { path: '/watchlist', element: <WatchlistPage /> },
          { path: '/lists', element: <MyListsPage /> },
          { path: '/lists/:listId', element: <ListDetailPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])