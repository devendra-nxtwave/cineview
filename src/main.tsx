import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'
import './Preferences/data/i18n/i18n'
import { preferencesStore } from './Preferences/data/stores/PreferencesStore'
import { collectionStore } from './Collection/data/stores/CollectionStore'
import { ThemeSync } from './Preferences/ui/components/ThemeSync/ThemeSync'

preferencesStore.init()
collectionStore.init()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeSync />
    <RouterProvider router={router} />
  </StrictMode>,
)