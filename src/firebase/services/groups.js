import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy,
} from 'firebase/firestore'
import { db }          from './db'
import { groupsPath }  from '../paths'

export const getGroups = async (orgId) => {
  const q    = query(collection(db, groupsPath(orgId)), orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addGroup    = (orgId, data)          => addDoc(collection(db, groupsPath(orgId)), data)
export const updateGroup = (orgId, groupId, data) => updateDoc(doc(db, groupsPath(orgId), groupId), data)
export const deleteGroup = (orgId, groupId)       => deleteDoc(doc(db, groupsPath(orgId), groupId))

export async function removeClientFromAllGroups(orgId, clientId) {
  const groups   = await getGroups(orgId)
  const promises = groups
    .filter(g => g.clientIds.includes(clientId))
    .map(g => updateGroup(orgId, g.id, {
      clientIds: g.clientIds.filter(id => id !== clientId),
    }))
  await Promise.all(promises)
}
