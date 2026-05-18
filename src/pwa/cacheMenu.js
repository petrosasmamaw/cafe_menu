import { saveMenuList, saveBranches } from './indexedDB'

export async function cacheMenuResponse(menuArray) {
  try {
    if (!Array.isArray(menuArray)) return
    await saveMenuList(menuArray)
  } catch (err) {
    console.error('cacheMenuResponse error', err)
  }
}

export async function cacheBranches(branches) {
  try {
    if (!Array.isArray(branches)) return
    await saveBranches(branches)
  } catch (err) {
    console.error('cacheBranches error', err)
  }
}

export default { cacheMenuResponse, cacheBranches }
