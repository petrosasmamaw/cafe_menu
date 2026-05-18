export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

export function onOnline(cb) {
  if (typeof window === 'undefined') return
  window.addEventListener('online', cb)
}

export function onOffline(cb) {
  if (typeof window === 'undefined') return
  window.addEventListener('offline', cb)
}

export function removeOnline(cb) {
  if (typeof window === 'undefined') return
  window.removeEventListener('online', cb)
}

export function removeOffline(cb) {
  if (typeof window === 'undefined') return
  window.removeEventListener('offline', cb)
}
