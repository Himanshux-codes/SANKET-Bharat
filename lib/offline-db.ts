import { requireSandbox, restoreSandbox, type WorkflowMetadata } from './data-mode'
/**
 * SANKET Bharat Offline Storage Layer
 * Native IndexedDB implementation for caching and queueing emergency citizen reports
 * when device is offline, including local binary attachments (Blobs).
 * No external dependencies required.
 */

export type OfflineQueueStatus = 'queued' | 'syncing' | 'synced' | 'failed'

export interface QueuedOfflineReport extends WorkflowMetadata {
  id: string // Local submission ID (e.g., OFFLINE-RPT-1740428123-A9F3)
  emergencyType: string
  severity: 'Moderate' | 'High' | 'Critical'
  location: string
  coordinates?: string
  description: string
  affected?: string
  name?: string
  contact?: string
  fileName?: string
  imageBlob?: Blob | null // Binary blob stored directly in IndexedDB (not localStorage)
  createdAt: string // Original ISO 8601 creation timestamp
  status: OfflineQueueStatus
  retryCount: number
  syncedIncidentId?: string // Associated INC-XXXX ID once synced
  syncedAt?: string // Timestamp when sync completed
  error?: string // Last sync error message if failed
}

const DB_NAME = 'sanket_bharat_offline_db'
const DB_VERSION = 1
const STORE_NAME = 'reports_queue'

function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window
}

export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      reject(new Error('IndexedDB is not supported in this browser environment.'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('status', 'status', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB.'))
    }
  })
}

export function generateLocalSubmissionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `OFFLINE-RPT-${timestamp}-${random}`
}

export async function saveOfflineReport(
  reportData: Omit<QueuedOfflineReport, 'id' | 'createdAt' | 'status' | 'retryCount'> & {
    id?: string
    createdAt?: string
  }
): Promise<QueuedOfflineReport> {
  requireSandbox(reportData)
  const db = await openOfflineDB()
  const id = reportData.id || generateLocalSubmissionId()
  const createdAt = reportData.createdAt || new Date().toISOString()

  const record: QueuedOfflineReport = {
    ...reportData,
    id,
    createdAt,
    status: 'queued',
    retryCount: 0,
  }

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const putRequest = store.put(record)

      putRequest.onsuccess = () => {
        resolve(record)
      }

      putRequest.onerror = () => {
        reject(putRequest.error || new Error('Failed to save offline report.'))
      }
    } catch (err) {
      reject(err)
    }
  })
}

export async function getOfflineReports(): Promise<QueuedOfflineReport[]> {
  if (!isIndexedDBSupported()) return []
  try {
    const db = await openOfflineDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        // Sort by createdAt descending (newest first)
        const results = restoreSandbox<QueuedOfflineReport>(request.result || [])
        results.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        resolve(results)
      }

      request.onerror = () => {
        reject(request.error || new Error('Failed to retrieve offline reports.'))
      }
    })
  } catch (err) {
    console.error('Error fetching offline reports from IndexedDB:', err)
    return []
  }
}

export async function getPendingOfflineReports(): Promise<QueuedOfflineReport[]> {
  const all = await getOfflineReports()
  return all.filter((report) => report.status === 'queued' || report.status === 'failed')
}

export async function updateOfflineReportStatus(
  id: string,
  status: OfflineQueueStatus,
  extra?: {
    syncedIncidentId?: string
    syncedAt?: string
    error?: string
    incrementRetry?: boolean
  }
): Promise<void> {
  const db = await openOfflineDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const record = getRequest.result as QueuedOfflineReport | undefined
        if (!record) {
          reject(new Error(`Report with id ${id} not found in offline database.`))
          return
        }

        record.status = status
        if (extra?.syncedIncidentId) record.syncedIncidentId = extra.syncedIncidentId
        if (extra?.syncedAt) record.syncedAt = extra.syncedAt
        if (extra?.error !== undefined) record.error = extra.error
        if (extra?.incrementRetry) record.retryCount = (record.retryCount || 0) + 1

        const updateRequest = store.put(record)
        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      }

      getRequest.onerror = () => reject(getRequest.error)
    } catch (err) {
      reject(err)
    }
  })
}

export async function deleteOfflineReport(id: string): Promise<void> {
  const db = await openOfflineDB()
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    } catch (err) {
      reject(err)
    }
  })
}

export async function clearSyncedReports(): Promise<void> {
  const all = await getOfflineReports()
  const synced = all.filter((r) => r.status === 'synced')
  for (const item of synced) {
    await deleteOfflineReport(item.id).catch(() => {})
  }
}
