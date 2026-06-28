import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../../../../Common'
import { sessionService } from '../../../../Auth/data/services/sessionService'
import { SUPPORTED_LOCALES, SUPPORTED_REGIONS } from '../../../core/constants'
import { preferencesStore } from '../../../data/stores/PreferencesStore'
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher'
import { RegionSelector } from '../../components/RegionSelector/RegionSelector'
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle'

export const SettingsPage = observer(function SettingsPage() {
  const { t } = useTranslation('preferences')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()

  function handleLogout() {
    sessionService.clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <PageShell title={t('title')}>
      <section className="settings-section">
        <h2>{t('language.title')}</h2>
        <p>{t('language.description')}</p>
        <LanguageSwitcher
          value={preferencesStore.language}
          options={SUPPORTED_LOCALES}
          onChange={(code) => preferencesStore.setLanguage(code)}
        />
      </section>

      <section className="settings-section">
        <h2>{t('region.title')}</h2>
        <p>{t('region.description')}</p>
        <RegionSelector
          value={preferencesStore.region}
          options={SUPPORTED_REGIONS}
          onChange={(code) => preferencesStore.setRegion(code)}
        />
      </section>

      <section className="settings-section">
        <h2>{t('theme.title')}</h2>
        <ThemeToggle
          value={preferencesStore.theme}
          onChange={(theme) => preferencesStore.setTheme(theme)}
        />
      </section>

      <button type="button" className="settings-logout" onClick={handleLogout}>
        {tCommon('logout')}
      </button>
    </PageShell>
  )
})