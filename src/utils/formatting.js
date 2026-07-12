<<<<<<< HEAD
export const formatDateTime = (isoString) => {
  const date = new Date(isoString)
=======
export function toCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0))
}

export function formatDateTime(value) {
  if (!value) {
    return 'N/A'
  }

  const date = new Date(value)
>>>>>>> master

  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
<<<<<<< HEAD
    day: '2-digit',
=======
    day: 'numeric',
    year: 'numeric',
>>>>>>> master
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
<<<<<<< HEAD

export const toCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
=======
>>>>>>> master
