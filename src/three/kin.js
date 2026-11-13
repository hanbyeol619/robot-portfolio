// 로봇팔 자세 계산 도우미
export const DOWN = 'down'
export const smooth = (t) => t * t * (3 - 2 * t)
export const clamp01 = (t) => Math.min(1, Math.max(0, t))

// 키프레임: t(초 또는 진행도), yaw/어깨/팔꿈치/손목(라디안), g(그리퍼 0=열림 1=닫힘)
export function key(t, yaw, sh, el, wr, g) {
  return { t, yaw, sh, el, wr: wr === DOWN ? Math.PI - sh - el : wr, g }
}

export function sampleAt(keys, c) {
  if (c <= keys[0].t) return keys[0]
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1]
    if (c <= b.t) {
      const u = smooth((c - a.t) / (b.t - a.t || 1))
      return {
        yaw: a.yaw + (b.yaw - a.yaw) * u,
        sh: a.sh + (b.sh - a.sh) * u,
        el: a.el + (b.el - a.el) * u,
        wr: a.wr + (b.wr - a.wr) * u,
        g: a.g + (b.g - a.g) * u,
      }
    }
  }
  return keys[keys.length - 1]
}

export function sampleLoop(keys, time) {
  const T = keys[keys.length - 1].t
  return sampleAt(keys, ((time % T) + T) % T)
}

// 정기구학: 자세 → 그리퍼 끝 위치 (로봇팔 기준 좌표)
export function fk(d, p, s = 1) {
  const a2 = p.sh + p.el, a3 = a2 + p.wr
  const r = d.L1 * Math.sin(p.sh) + d.L2 * Math.sin(a2) + d.L3 * Math.sin(a3)
  const y = d.H0 + d.L1 * Math.cos(p.sh) + d.L2 * Math.cos(a2) + d.L3 * Math.cos(a3)
  return [r * Math.cos(p.yaw) * s, y * s, -r * Math.sin(p.yaw) * s]
}
