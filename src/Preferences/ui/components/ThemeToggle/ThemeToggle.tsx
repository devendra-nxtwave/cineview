import { useTranslation } from 'react-i18next'
import type { Theme } from '../../../core/types'

type ThemeToggleProps = {
  value: Theme
  onChange: (theme: Theme) => void
}

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  const { t } = useTranslation('preferences')

  return (
    <div className="theme-toggle">
      <button
        type="button"
        className={value === 'light' ? 'active' : ''}
        onClick={() => onChange('light')}
      >
        {t('theme.light')}
      </button>
      <button
        type="button"
        className={value === 'dark' ? 'active' : ''}
        onClick={() => onChange('dark')}
      >
        {t('theme.dark')}
      </button>
    </div>
  )
}