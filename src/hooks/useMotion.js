import { useEffect, useRef } from 'react'

/**
 * Applica animazione di entrata a un elemento.
 * Rimuove la classe di animazione al termine.
 */
export function useEnterAnimation(className = 'animate-fade-up') {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add(className)
    const handler = () => el.classList.remove(className)
    el.addEventListener('animationend', handler, { once: true })
    return () => el.removeEventListener('animationend', handler)
  }, [className])

  return ref
}

/**
 * Applica stagger animation ai figli di un container.
 * Ogni figlio entra con un delay crescente.
 */
export function useStagger(itemCount, baseDelay = 50) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const children = Array.from(el.children)
    children.forEach((child, i) => {
      child.style.opacity   = '0'
      child.style.animation = `fade-up var(--duration-normal) var(--ease-enter) ${i * baseDelay}ms forwards`
    })
  }, [itemCount, baseDelay])

  return ref
}
