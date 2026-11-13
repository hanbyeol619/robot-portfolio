import { useCallback, useEffect, useRef, useState } from 'react'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const INTRO_MS = 1700

/* 첫 방문 부팅 인트로 (세션당 한 번) */
export function useBoot() {
  const [showIntro] = useState(() => {
    if (reduceMotion()) return false
    try {
      return sessionStorage.getItem('hb-intro') !== '1'
    } catch {
      return true
    }
  })
  const [visible, setVisible] = useState(showIntro)
  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem('hb-intro', '1') } catch { /* 저장 불가 시 무시 */ }
    setVisible(false)
  }, [])
  return { showIntro: visible, bootDelay: showIntro ? INTRO_MS / 1000 + 0.15 : 0.2, finishIntro }
}

const LINES = [
  'J1 BASE ............ OK',
  'J2 SHOULDER ........ OK',
  'J3 ELBOW ........... OK',
  'J4 WRIST ........... OK',
  'GRIPPER ............ OK',
  'LIDAR · NAV ........ OK',
  'POLICY  imitation_v3  LOADED',
]

export function BootIntro({ name, onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    const t0 = performance.now()
    let raf
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / INTRO_MS)
      setPct(Math.round((1 - Math.pow(1 - k, 3)) * 100))
      if (k < 1) raf = requestAnimationFrame(tick)
      else {
        setLeaving(true)
        setTimeout(onDone, 750)
      }
    }
    raf = requestAnimationFrame(tick)
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [onDone])
  return (
    <div className={`boot ${leaving ? 'leave' : ''}`} aria-hidden="true">
      <div className="boot-top mono">
        <span>{name} · ROBOTICS PORTFOLIO</span>
        <span>SYSTEM BOOT</span>
      </div>
      <ul className="boot-lines">
        {LINES.map((l, i) => (
          <li key={l} style={{ animationDelay: `${i * 0.16}s` }}>{l}</li>
        ))}
      </ul>
      <div className="boot-pct">
        {String(pct).padStart(3, '0')}
        <small>%</small>
      </div>
      <div className="boot-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
    </div>
  )
}

/* 흐르는 키워드 띠 */
export function Marquee({ items }) {
  const row = items.map((t) => (
    <span key={t} className="mq-item">
      {t}<i aria-hidden="true">✳</i>
    </span>
  ))
  return (
    <div className="marquee" aria-label={items.join(', ')}>
      <div className="mq-track" aria-hidden="true">
        {row}{row}{row}{row}
      </div>
    </div>
  )
}

/* 데스크톱 전용 커스텀 커서 */
export function Cursor() {
  const dot = useRef(null), ring = useRef(null), label = useRef(null)
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches && !reduceMotion())
  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const pos = { x: -100, y: -100 }, rp = { x: -100, y: -100 }
    let raf
    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const el = e.target.closest?.('a, button, [role="tab"]')
      const view = e.target.closest?.('.card-hit, .act-photo')
      ring.current.classList.toggle('hover', !!el && !view)
      ring.current.classList.toggle('view', !!view)
      label.current.textContent = view ? (view.classList.contains('act-photo') ? 'OPEN' : 'VIEW') : ''
    }
    const leave = () => { pos.x = pos.y = -100 }
    const loop = () => {
      rp.x += (pos.x - rp.x) * 0.18
      rp.y += (pos.y - rp.y) * 0.18
      dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      ring.current.style.transform = `translate(${rp.x}px, ${rp.y}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(loop)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [enabled])
  if (!enabled) return null
  return (
    <>
      <div ref={dot} className="cur-dot" aria-hidden="true" />
      <div ref={ring} className="cur-ring" aria-hidden="true"><span ref={label} /></div>
    </>
  )
}
