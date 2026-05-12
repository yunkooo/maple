export const formatNumber = (value?: number | string | null) => {
  if (value == null || value === '') {
    return '-'
  }

  const numericValue =
    typeof value === 'number'
      ? value
      : Number.parseFloat(value.replace(/,/g, ''))

  return Number.isNaN(numericValue)
    ? String(value)
    : numericValue.toLocaleString()
}
