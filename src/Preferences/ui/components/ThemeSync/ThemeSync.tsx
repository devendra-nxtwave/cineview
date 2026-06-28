import { observer } from 'mobx-react-lite'
import { preferencesStore } from '../../../data/stores/PreferencesStore'

export const ThemeSync = observer(function ThemeSync() {
  document.documentElement.dataset.theme = preferencesStore.theme
  return null
})