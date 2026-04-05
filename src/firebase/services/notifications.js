import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, where, orderBy,
} from 'firebase/firestore'
import { db }                from './db'
import { notificationsPath } from '../paths'

export const getNotifications = async (orgId, clientId) => {
  try {
    const q    = query(
      collection(db, notificationsPath(orgId)),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

export const addNotification = (orgId, data) =>
  addDoc(collection(db, notificationsPath(orgId)), {
    ...data,
    read:      false,
    createdAt: new Date().toISOString(),
  })

export const markNotificationRead = (orgId, id) =>
  updateDoc(doc(db, notificationsPath(orgId), id), { read: true })

export const markAllNotificationsRead = async (orgId, clientId, readAt = new Date().toISOString()) => {
  const notifs = await getNotifications(orgId, clientId)
  await Promise.all(
    notifs.filter(n => !n.read).map(n =>
      updateDoc(doc(db, notificationsPath(orgId), n.id), { read: true, readAt })
    )
  )
}

export const deleteNotification = (orgId, id) =>
  deleteDoc(doc(db, notificationsPath(orgId), id))
