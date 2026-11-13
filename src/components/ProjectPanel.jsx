import { useEffect, useRef, useState } from 'react'

function Media({ src, className }) {
  if (!src) return null
  return /\.(mp4|webm|mov)$/i.test(src) ? (
    <video className={className} src={src} autoPlay muted loop playsInline />
  ) : (
    <img className={className} src={src} alt="" />
  )
}

function Video({ v }) {
  if (v.type === 'youtube')
    return (
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${v.id}`}
          title={v.title || '프로젝트 영상'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  return (
    <div className="video-frame">
      <video src={v.src} controls playsInline preload="metadata" />
    </div>
  )
}

export default function ProjectPanel({ project, onClose, onNav, index, total }) {
  const closeRef = useRef(null)
  const scrollRef = useRef(null)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    closeRef.current?.focus()
    scrollRef.current?.scrollTo(0, 0)
    setLightbox(null)
  }, [project.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') (lightbox !== null ? setLightbox(null) : onClose())
      if (lightbox !== null && e.key === 'ArrowRight') setLightbox((i) => (i + 1) % project.photos.length)
      if (lightbox !== null && e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + project.photos.length) % project.photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, onClose, project.photos.length])

  const meta = [
    ['기간', project.period],
    ['역할', project.role],
    ['팀', project.team],
  ].filter(([, v]) => v)

  return (
    <div className="panel-wrap" role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <button className="panel-scrim" aria-label="닫기" onClick={onClose} tabIndex={-1} />
      <aside className="panel" ref={scrollRef}>
        <div className="panel-top">
          <span className="mono">{project.label} · {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
          <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>

        <div className="panel-cover">
          {project.cover ? (
            <Media src={project.cover} className="cover-media" />
          ) : (
            <div className="cover-type" aria-hidden="true">{project.code}</div>
          )}
        </div>

        <div className="panel-body">
          <p className="mono accent">{project.code}</p>
          <h2 id="panel-title">{project.title}</h2>
          <p className="panel-sub">{project.subtitle}</p>

          {meta.length > 0 && (
            <dl className="meta">
              {meta.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          )}
          <ul className="tags">{project.tags.map((t) => <li key={t}>{t}</li>)}</ul>

          <section>
            <h3>개요</h3>
            <p>{project.summary}</p>
          </section>

          {project.goals.length > 0 && (
            <section>
              <h3>목표</h3>
              <ul className="dash">{project.goals.map((g) => <li key={g}>{g}</li>)}</ul>
            </section>
          )}

          {project.work.length > 0 && (
            <section>
              <h3>내가 한 일</h3>
              <div className="work">
                {project.work.map((w) => (
                  <div key={w.title}><h4>{w.title}</h4><p>{w.desc}</p></div>
                ))}
              </div>
            </section>
          )}

          {project.results.length > 0 && (
            <section>
              <h3>결과</h3>
              <ul className="dash">{project.results.map((r) => <li key={r}>{r}</li>)}</ul>
            </section>
          )}

          <section>
            <h3>사진</h3>
            {project.photos.length ? (
              <div className="gallery">
                {project.photos.map((ph, i) => (
                  <button key={ph.src} className="thumb" onClick={() => setLightbox(i)} aria-label={`사진 크게 보기: ${ph.caption || i + 1}`}>
                    <img src={ph.src} alt={ph.caption || ''} loading="lazy" />
                    {ph.caption && <span>{ph.caption}</span>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty">작업 사진을 준비하고 있어요.</div>
            )}
          </section>

          <section>
            <h3>영상</h3>
            {project.videos.length ? (
              <div className="videos">
                {project.videos.map((v, i) => (
                  <figure key={i}>
                    <Video v={v} />
                    {v.title && <figcaption>{v.title}</figcaption>}
                  </figure>
                ))}
              </div>
            ) : (
              <div className="empty">시연 영상을 준비하고 있어요.</div>
            )}
          </section>

          {project.links.length > 0 && (
            <section>
              <h3>링크</h3>
              <div className="links">
                {project.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>
                ))}
              </div>
            </section>
          )}

          <nav className="panel-nav" aria-label="다른 프로젝트">
            <button onClick={() => onNav(-1)}>← 이전 프로젝트</button>
            <button onClick={() => onNav(1)}>다음 프로젝트 →</button>
          </nav>
        </div>
      </aside>

      {lightbox !== null && project.photos[lightbox] && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={project.photos[lightbox].src} alt={project.photos[lightbox].caption || ''} />
          {project.photos[lightbox].caption && <p>{project.photos[lightbox].caption}</p>}
        </div>
      )}
    </div>
  )
}
