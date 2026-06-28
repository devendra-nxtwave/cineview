export function formatDate(dateString: string, locale: string): string {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return dateString
  
    const localeTag =
      locale === 'hi' ? 'hi-IN' : locale === 'te' ? 'te-IN' : 'en-US'
  
    return new Intl.DateTimeFormat(localeTag, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }