import { openDB } from 'idb'

const DB_NAME = 'lol-cafe-store'
const DB_VERSION = 1

let dbPromise

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('menu')) db.createObjectStore('menu', { keyPath: 'id' })
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta')
        if (!db.objectStoreNames.contains('branches')) db.createObjectStore('branches', { keyPath: 'id' })
        if (!db.objectStoreNames.contains('sync-queue')) db.createObjectStore('sync-queue', { autoIncrement: true })
      }
    })
  }
  return dbPromise
}

export async function saveMenuList(menuArray) {
  const db = await getDB()
  const tx = db.transaction('menu', 'readwrite')
  await Promise.all(menuArray.map(item => tx.store.put(item)))
  await tx.done
  // record last sync time
  await (await getDB()).put('meta', { value: Date.now() }, 'lastMenuSync')
}

export async function getAllMenu() {
  const db = await getDB()
  return db.getAll('menu')
}

export async function saveBranches(branches) {
  const db = await getDB()
  const tx = db.transaction('branches', 'readwrite')
  await Promise.all(branches.map(b => tx.store.put(b)))
  await tx.done
}

export async function getAllBranches() {
  const db = await getDB()
  return (await getDB()).getAll('branches')
}

export async function enqueueSync(payload) {
  const db = await getDB()
  return db.add('sync-queue', payload)
}

export async function drainSyncQueue() {
  const db = await getDB()
  const all = await db.getAll('sync-queue')
  const tx = db.transaction('sync-queue', 'readwrite')
  for (const key of await db.getAllKeys('sync-queue')) {
    tx.store.delete(key)
  }
  await tx.done
  return all
}

export async function clearMenu() {
  const db = await getDB()
  const tx = db.transaction('menu', 'readwrite')
  await tx.store.clear()
  await tx.done
}

export default { getDB, saveMenuList, getAllMenu, saveBranches, getAllBranches, enqueueSync, drainSyncQueue, clearMenu }
