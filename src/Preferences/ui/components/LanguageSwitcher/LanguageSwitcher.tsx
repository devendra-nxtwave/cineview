type Option = { code: string; label: string }

type LanguageSwitcherProps = {
  value: string
  options: readonly Option[]
  onChange: (code: string) => void
}

export function LanguageSwitcher({ value, options, onChange }: LanguageSwitcherProps) {
  return (
    <select
      className="language-switcher"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Language"
    >
      {options.map((opt) => (
        <option key={opt.code} value={opt.code}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}