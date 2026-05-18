import { drainSyncQueue } from './indexedDB'

export async function processSyncQueue() {
  try {
    const items = await drainSyncQueue()
    for (const req of items) {
      // naive replay: assume payload contains { url, options }
      try {
        await fetch(req.url, req.options)
      } catch (err) {
        console.warn('sync replay failed', err)
        // if fails, re-enqueue — left as an exercise
      }
    }
  } catch (err) {
    console.error('processSyncQueue error', err)
  }
}

export default { processSyncQueue }
