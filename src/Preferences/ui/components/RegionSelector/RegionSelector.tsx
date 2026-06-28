type Option = { code: string; label: string }

type RegionSelectorProps = {
  value: string
  options: readonly Option[]
  onChange: (code: string) => void
}

export function RegionSelector({ value, options, onChange }: RegionSelectorProps) {
  return (
    <select
      className="region-selector"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Region"
    >
      {options.map((opt) => (
        <option key={opt.code} value={opt.code}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}