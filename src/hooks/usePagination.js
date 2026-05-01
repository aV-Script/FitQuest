import { useState, useMemo, useEffect } from 'react'

export function usePagination(items, pageSize = 12, resetKey = undefined) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [items.length, resetKey])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  const goTo = (n)  => setPage(Math.max(1, Math.min(n, totalPages)))
  const next  = ()  => goTo(page + 1)
  const prev  = ()  => goTo(page - 1)

  return {
    page,
    totalPages,
    paginatedItems,
    goTo,
    next,
    prev,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    from:    (page - 1) * pageSize + 1,
    to:      Math.min(page * pageSize, items.length),
    total:   items.length,
  }
}