import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { profile } from './data/profile'
import { projects } from './data/projects'
import { HeroScene, ArmScene, DrivingScene, OmxScene, MainScene } from './three/scenes'
import ProjectPanel from './components/ProjectPanel'

const SCENES = { main: MainScene, arm: ArmScene, driving: DrivingScene, omx: OmxScene }
const CAPTIONS = [
  { at: 0.22, text: '사람이 허리를 숙여 반복하던 일을' },
  { at: 0.5, text: '로봇의 정확한 동작으로 바꾸고' },
  { at: 0.8, text: '현장을 조금 더 이롭게 만듭니다' },
]

function HeroVideo({ src, progress }) {
  const ref = useRef(null)
  useEffect(() => {
    let raf
    const tick = () => {
      const v = ref.current
      if (v && v.duration) {
        const target = progress.current * (v.duration - 0.05)
        if (Math.abs(v.currentTime - target) > 0.03) v.currentTime = target
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress])
  return <video ref={ref} className="hero-video" src={src} muted playsInline preload="auto" />
}

export default function App() {
  const heroRef = useRef(null)
  const progress = useRef(0)
  const [open, setOpen] = useState(null)
  const [photo, setPhoto] = useState(null)

  // 스크롤 → 첫 화면 진행도
  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)))
      progress.current = p
      el.style.setProperty('--p', p.toFixed(4))
      el.querySelectorAll('.hero-captions li').forEach((li) => {
        const d = p - Number(li.dataset.at)
        const o = Math.max(0, 1 - Math.abs(d) / 0.12)
        li.style.opacity = o.toFixed(3)
        li.style.transform = `translateY(${(-d * 120).toFixed(1)}px)`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // 주소 #main, #arm … 으로 바로 열기
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1)
      setOpen(projects.some((p) => p.id === id) ? id : null)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open || photo ? 'hidden' : ''
  }, [open, photo])

  useEffect(() => {
    if (!photo) return
    const onKey = (e) => e.key === 'Escape' && setPhoto(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photo])

  const openProject = useCallback((id) => {
    if (window.location.hash !== `#${id}`) window.location.hash = id
    setOpen(id)
  }, [])
  const close = useCallback(() => {
    history.replaceState(null, '', window.location.pathname + window.location.search)
    setOpen(null)
  }, [])
  const nav = useCallback(
    (dir) => {
      const i = projects.findIndex((p) => p.id === open)
      openProject(projects[(i + dir + projects.length) % projects.length].id)
    },
    [open, openProject]
  )

  const current = projects.find((p) => p.id === open)
  const [main, ...subs] = projects

  return (
    <>
      <header className="site-header">
        <a href="#top" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          {profile.nameEn}
        </a>
        <nav aria-label="메뉴">
          <a href="#work" onClick={(e) => { e.preventDefault(); document.getElementById('work').scrollIntoView({ behavior: 'smooth' }) }}>Projects</a>
          <a href="#activity" onClick={(e) => { e.preventDefault(); document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth' }) }}>Activity</a>
          <a href="#about-me" onClick={(e) => { e.preventDefault(); document.getElementById('about-me').scrollIntoView({ behavior: 'smooth' }) }}>About</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }}>Contact</a>
        </nav>
      </header>

      {/* ── 첫 화면 ── */}
      <section className="hero" ref={heroRef} id="top">
        <div className="hero-sticky">
          <div className="hero-type" aria-hidden="true">
            <span>ROBOTS</span>
            <span>FOR PEOPLE</span>
          </div>
          {profile.heroVideo ? (
            <HeroVideo src={profile.heroVideo} progress={progress} />
          ) : (
            <View className="hero-view">
              <HeroScene progress={progress} />
            </View>
          )}
          <div className="hero-meta">
            <p className="mono">PORTFOLIO — {profile.year}</p>
            <h1>
              {profile.name}
              <small>{profile.role}</small>
            </h1>
            <p className="hero-intro">{profile.intro}</p>
          </div>
          <ol className="hero-captions" aria-label="소개 문장">
            {CAPTIONS.map((c, i) => (
              <li key={i} data-at={c.at}>{c.text}</li>
            ))}
          </ol>
          <div className="hero-progress mono" aria-hidden="true">
            <span className="bar"><i /></span>SCROLL
          </div>
        </div>
      </section>

      {/* ── 프로젝트 4구역 ── */}
      <section id="work" className="work-section">
        <div className="section-head">
          <p className="mono">SELECTED WORK · 04</p>
          <h2>네 개의 구역,<br />하나의 로봇 시스템</h2>
          <p className="muted">메인 통합 프로젝트와, 그 안에 들어간 세 개의 프로젝트예요. 구역을 누르면 작업 과정과 사진, 영상을 볼 수 있어요.</p>
        </div>

        <ProjectCard p={main} big onOpen={openProject} />
        <div className="sub-grid">
          {subs.map((p) => (
            <ProjectCard key={p.id} p={p} onOpen={openProject} />
          ))}
        </div>
      </section>

      {/* ── 활동 ── */}
      {profile.activities?.length > 0 && (
        <section id="activity" className="activity">
          <p className="mono">ACTIVITY</p>
          <h2>배우러 간 자리들</h2>
          {profile.activities.map((a) => (
            <article key={a.title} className="act">
              <div className="act-head">
                <h3>{a.title}</h3>
                <p className="mono">{[a.date, a.place].filter(Boolean).join(' · ')}</p>
                <p className="act-desc">{a.desc}</p>
              </div>
              {a.photos.length ? (
                <div className="act-photos">
                  {a.photos.map((ph, i) => (
                    <button key={ph.src} className={`act-photo ${i === 0 ? 'first' : ''}`} onClick={() => setPhoto(ph)} aria-label={`사진 크게 보기: ${ph.caption || a.title}`}>
                      <img src={ph.src} alt={ph.caption || a.title} loading="lazy" />
                      {ph.caption && <span>{ph.caption}</span>}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty">현장 사진을 곧 추가할게요.</div>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ── 소개 ── */}
      <section id="about-me" className="about">
        <p className="mono">ABOUT</p>
        <div className="about-grid">
          <h2>불편한 걸 보면<br />고치고 싶어지는 사람</h2>
          <div className="about-text">
            {profile.about.map((t, i) => <p key={i}>{t}</p>)}
            <ul className="tags">{profile.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* ── 연락 ── */}
      <section id="contact" className="contact">
        <p className="mono">CONTACT</p>
        <h2>사람에게 이로운 것을<br />함께 만들어요</h2>
        <div className="contact-rows">
          {profile.email && <ContactRow k="EMAIL" v={profile.email} copy />}
          {profile.github && <ContactRow k="GITHUB" v={profile.github} href={profile.github} />}
          {profile.blog && <ContactRow k="BLOG" v={profile.blog} href={profile.blog} />}
          {!profile.email && !profile.github && !profile.blog && (
            <p className="muted">연락처는 src/data/profile.js 에서 채울 수 있어요.</p>
          )}
        </div>
        <footer className="foot mono">© {profile.year} {profile.nameEn} · 3D 로봇은 실제 프로젝트를 단순화한 모형입니다</footer>
      </section>

      {photo && (
        <div className="lightbox" role="dialog" aria-label="사진 크게 보기" onClick={() => setPhoto(null)}>
          <img src={photo.src} alt={photo.caption || ''} />
          {photo.caption && <p>{photo.caption}</p>}
        </div>
      )}

      {current && (
        <ProjectPanel
          project={current}
          index={projects.indexOf(current)}
          total={projects.length}
          onClose={close}
          onNav={nav}
        />
      )}

      <Canvas
        className="gl"
        eventSource={document.getElementById('root')}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
    </>
  )
}

function ProjectCard({ p, big, onOpen }) {
  const Scene = SCENES[p.id]
  return (
    <article className={`card ${big ? 'card-big' : ''}`} style={{ '--c': p.color }}>
      <button className="card-hit" onClick={() => onOpen(p.id)} aria-label={`${p.title} 자세히 보기`} />
      <div className="card-stage">
        {p.cover ? (
          /\.(mp4|webm|mov)$/i.test(p.cover) ? (
            <video src={p.cover} autoPlay muted loop playsInline />
          ) : (
            <img src={p.cover} alt="" />
          )
        ) : (
          <View className="card-view">
            <Scene />
          </View>
        )}
        <span className="card-code mono">{p.code}</span>
      </div>
      <div className="card-text">
        <p className="mono">{p.label}</p>
        <h3>{p.title}</h3>
        <p className="muted">{p.subtitle}</p>
        <ul className="tags">{p.tags.slice(0, big ? 5 : 3).map((t) => <li key={t}>{t}</li>)}</ul>
        <span className="more">자세히 보기 →</span>
      </div>
    </article>
  )
}

function ContactRow({ k, v, href, copy }) {
  const [done, setDone] = useState(false)
  return (
    <div className="contact-row">
      <span className="mono">{k}</span>
      {href ? <a href={href} target="_blank" rel="noreferrer">{v}</a> : <span className="big">{v}</span>}
      {copy && (
        <button
          className="copy"
          onClick={() =>
            navigator.clipboard?.writeText(v).then(() => { setDone(true); setTimeout(() => setDone(false), 1600) }).catch(() => {})
          }
        >
          {done ? '복사됨' : '복사'}
        </button>
      )}
    </div>
  )
}
