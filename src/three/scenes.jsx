import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Line } from '@react-three/drei'
import { M, lathe } from './materials'
import { Studio, Cam, Seedling, PottedPlant, ArmRig, MobileBase, IND, SERVO } from './parts'
import { key, DOWN, sampleAt, sampleLoop, fk, smooth, clamp01 } from './kin'

const v3 = () => new THREE.Vector3()
const POT_ONLY = [[0, 0], [0.24, 0], [0.27, 0.03], [0.32, 0.4], [0.34, 0.42], [0.34, 0.45], [0.31, 0.45], [0.29, 0.42], [0, 0.42]]

/* ═════════ 첫 화면: 스크롤로 움직이는 대형 로봇팔 ═════════ */
const HERO_KEYS = [
  key(0, -1.57, -0.12, 1.55, 1.0, 1),
  key(2.5, -0.95, 0.05, 0.45, 0.35, 1),
  key(5, -1.57, 0.5, 0.62, 0.5, 1),
  key(7.5, -2.5, 0.35, 1.15, DOWN, 1),
  key(9.2, -2.95, 0.8, 1.05, DOWN, 1),
  key(10, -2.95, 0.8, 1.05, DOWN, 0),
]

export function HeroScene({ progress }) {
  const arm = useRef(), plant = useRef(), group = useRef()
  const p = useRef(0)
  const { size } = useThree()
  const wide = size.width / size.height > 1.15
  const final = HERO_KEYS[HERO_KEYS.length - 1]
  const tipF = fk(IND, final)
  const plugY = tipF[1] - 0.08
  const soilTop = plugY + 0.12
  const potBase = soilTop - 0.4
  const tmp = useMemo(v3, [])

  useFrame((state, dt) => {
    p.current += (progress.current - p.current) * (1 - Math.exp(-dt * 6))
    const c = p.current * 10
    const pose = { ...sampleAt(HERO_KEYS, c) }
    const t = state.clock.elapsedTime
    const idle = 1 - smooth(clamp01((c - 8.4) / 0.8))
    pose.yaw += Math.sin(t * 0.55) * 0.035 * idle
    pose.wr += Math.sin(t * 0.8) * 0.05 * idle
    pose.sh += Math.sin(t * 0.4) * 0.02 * idle
    arm.current.apply(pose)
    if (c < 9.6) {
      arm.current.tipWorld(tmp)
      group.current.worldToLocal(tmp)
      plant.current.position.set(tmp.x, tmp.y - 0.08, tmp.z)
    } else plant.current.position.set(tipF[0], plugY, tipF[2])
  })

  return (
    <>
      <Cam
        position={[0, 2.7, 10]}
        target={[0, 1.75, 0]}
        fov={30}
        sway={0.35}
        fitAspect={0}
        getOrbit={() => ({ a: -0.35 + p.current * 0.85, y: p.current * 0.6, d: wide ? 1 : 1.25, lx: wide ? -1.2 : 0 })}
      />
      <Studio shadowScale={14} far={5} />
      <group ref={group}>
        <ArmRig ref={arm} variant="industrial" />
        <Seedling ref={plant} />
        <group position={[tipF[0], 0, tipF[2]]}>
          <mesh material={M.slabDark} position-y={potBase / 2}>
            <cylinderGeometry args={[0.36, 0.4, potBase, 48]} />
          </mesh>
          <mesh geometry={lathe(POT_ONLY)} material={M.ceramic} position-y={potBase} />
          <mesh material={M.soil} position-y={soilTop - 0.01}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
          </mesh>
        </group>
      </group>
    </>
  )
}

/* ═════════ 프로젝트 01: 묘목 이식 로봇팔 ═════════ */
const PY = -2.4, QY = -0.75
const ARM_KEYS = [
  key(0, -1.57, -0.1, 1.5, 0.9, 0),
  key(1.2, PY, 0.45, 1.35, DOWN, 0),
  key(2.0, PY, 0.85, 1.05, DOWN, 0),
  key(2.4, PY, 0.85, 1.05, DOWN, 1),
  key(3.3, PY, 0.45, 1.35, DOWN, 1),
  key(4.6, QY, 0.45, 1.35, DOWN, 1),
  key(5.4, QY, 0.8, 1.1, DOWN, 1),
  key(5.8, QY, 0.8, 1.1, DOWN, 0),
  key(6.6, QY, 0.3, 1.3, DOWN, 0),
  key(8, -1.57, -0.1, 1.5, 0.9, 0),
  key(9, -1.57, -0.1, 1.5, 0.9, 0),
]

export function ArmScene() {
  const arm = useRef(), hero = useRef()
  const P = fk(IND, ARM_KEYS[2]), Q = fk(IND, ARM_KEYS[6])
  const trayPlug = P[1] - 0.08, trayTop = trayPlug + 0.12
  const potPlug = Q[1] - 0.08, potSoil = potPlug + 0.12, potBase = potSoil - 0.4
  const tmp = useMemo(v3, [])
  const cells = useMemo(() => {
    const out = []
    let s = 11
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) out.push({ r, c, s: 0.85 + rnd() * 0.28, ry: rnd() * 6 })
    return out
  }, [])
  const CELL = 0.27, TR = 1, TC = 3
  const ox = -(TC - 2.5) * CELL, oz = -(TR - 1.5) * CELL

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const c = t % 9
    arm.current.apply(sampleLoop(ARM_KEYS, t))
    if (c < 2.3) {
      hero.current.position.set(P[0], trayPlug, P[2])
      hero.current.scale.setScalar(smooth(clamp01(c / 0.5)))
    } else if (c < 5.7) {
      arm.current.tipWorld(tmp)
      hero.current.position.set(tmp.x, tmp.y - 0.08, tmp.z)
      hero.current.scale.setScalar(1)
    } else hero.current.position.set(Q[0], potPlug, Q[2])
  })

  return (
    <>
      <Cam position={[0, 3.9, 8.8]} target={[0, 1.0, 0.7]} fov={34} />
      <Studio shadowScale={12} />
      <ArmRig ref={arm} variant="industrial" />
      <Seedling ref={hero} />
      <group position={[P[0], 0, P[2]]} rotation-y={PY}>
        <RoundedBox args={[6 * CELL + 0.4, trayTop - 0.1, 4 * CELL + 0.4]} radius={0.04} position={[ox, (trayTop - 0.1) / 2, oz]} material={M.slabDark} />
        <RoundedBox args={[6 * CELL + 0.1, 0.1, 4 * CELL + 0.1]} radius={0.02} position={[ox, trayTop - 0.05, oz]} material={M.tray} />
        {cells.map(({ r, c, s, ry }) => {
          const x = (c - TC) * CELL, z = (r - TR) * CELL
          return (
            <group key={`${r}-${c}`}>
              <mesh material={M.soil} position={[x, trayTop + 0.004, z]}>
                <boxGeometry args={[CELL * 0.82, 0.01, CELL * 0.82]} />
              </mesh>
              {!(r === TR && c === TC) && <Seedling position={[x, trayPlug, z]} scale={s} rotation-y={ry} plug={false} />}
            </group>
          )
        })}
      </group>
      <group position={[Q[0], 0, Q[2]]}>
        <mesh material={M.slabDark} position-y={potBase / 2}>
          <cylinderGeometry args={[0.36, 0.4, potBase, 48]} />
        </mesh>
        <mesh geometry={lathe(POT_ONLY)} material={M.ceramic} position-y={potBase} />
        <mesh material={M.soil} position-y={potSoil - 0.01}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        </mesh>
      </group>
    </>
  )
}

/* ═════════ 프로젝트 02: 자율주행 ═════════ */
function ribbon(curve, offset, width, y, n = 320) {
  const pos = [], nor = [], idx = []
  const p = v3(), t = v3()
  for (let i = 0; i <= n; i++) {
    const u = (i / n) % 1
    curve.getPointAt(u, p)
    curve.getTangentAt(u, t)
    const nx = -t.z, nz = t.x
    for (const s of [-1, 1]) {
      const o = offset + (s * width) / 2
      pos.push(p.x + nx * o, y, p.z + nz * o)
      nor.push(0, 1, 0)
    }
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setIndex(idx)
  return g
}
const CONE = [[0, 0], [0.17, 0], [0.17, 0.03], [0.05, 0.44], [0, 0.44]]

export function DrivingScene() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [[-2.9, -2.2], [0, -2.55], [2.9, -2.2], [3.25, 0.2], [2.5, 2.3], [0.4, 2.4], [-0.6, 0.95], [-2.0, 2.3], [-3.25, 0.6]].map(
          ([x, z]) => new THREE.Vector3(x, 0, z)
        ),
        true,
        'centripetal'
      ),
    []
  )
  const geos = useMemo(
    () => ({ road: ribbon(curve, 0, 0.95, 0.004), l: ribbon(curve, -0.44, 0.04, 0.008), r: ribbon(curve, 0.44, 0.04, 0.008) }),
    [curve]
  )
  const dashes = useMemo(() => {
    const out = []
    for (let k = 0; k < 38; k++) {
      const u = (k + 0.5) / 38
      const p = curve.getPointAt(u), t = curve.getTangentAt(u)
      out.push({ p: [p.x, 0.008, p.z], ry: Math.atan2(t.x, t.z) })
    }
    return out
  }, [curve])
  const len = useMemo(() => curve.getLength(), [curve])
  const robot = useRef(), wheels = useRef(), lidar = useRef(), path = useRef(), u = useRef(0.02)
  const pts = useMemo(() => Array.from({ length: 40 }, () => new THREE.Vector3()), [])
  const flat = useMemo(() => new Float32Array(120), [])
  const p = useMemo(v3, []), t = useMemo(v3, [])

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    curve.getTangentAt(u.current, t)
    const ahead = curve.getTangentAt((u.current + 0.03) % 1)
    const turn = 1 - Math.abs(t.x * ahead.z - t.z * ahead.x)
    const speed = 0.75 + 0.45 * turn
    u.current = (u.current + (d * speed) / len) % 1
    curve.getPointAt(u.current, p)
    robot.current.position.set(p.x, 0, p.z)
    const target = Math.atan2(t.x, t.z)
    let diff = target - robot.current.rotation.y
    diff = Math.atan2(Math.sin(diff), Math.cos(diff))
    robot.current.rotation.y += diff * (1 - Math.exp(-d * 10))
    wheels.current.children.forEach((w) => (w.rotation.x += (d * speed) / (0.17 * 0.7)))
    lidar.current.rotation.y += d * 5
    for (let i = 0; i < 40; i++) {
      curve.getPointAt((u.current + 0.02 + i * 0.004) % 1, pts[i])
      flat[i * 3] = pts[i].x
      flat[i * 3 + 1] = 0.03
      flat[i * 3 + 2] = pts[i].z
    }
    path.current?.geometry.setPositions(flat)
  })

  return (
    <>
      <Cam position={[0, 6.8, 8.4]} target={[0, 0, 0.3]} fov={36} />
      <Studio shadowScale={14} shadowY={0} far={2} />
      <RoundedBox args={[7.8, 0.2, 6.6]} radius={0.06} position-y={-0.1} material={M.slab} />
      <mesh geometry={geos.road} material={M.asphalt} />
      <mesh geometry={geos.l} material={M.lane} />
      <mesh geometry={geos.r} material={M.lane} />
      {dashes.map((d, i) => (
        <mesh key={i} material={M.lane} position={d.p} rotation-y={d.ry}>
          <boxGeometry args={[0.04, 0.002, 0.16]} />
        </mesh>
      ))}
      <Line ref={path} points={pts} color="#3d8bff" lineWidth={3} transparent opacity={0.9} />
      {[[0.9, -0.9], [-1.6, -0.5], [1.8, 0.7], [-0.2, -1.4]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh geometry={lathe(CONE, 32)} material={M.cone} />
          <mesh material={M.lane} position-y={0.24}>
            <cylinderGeometry args={[0.095, 0.115, 0.07, 32]} />
          </mesh>
        </group>
      ))}
      <RoundedBox args={[0.6, 0.45, 0.45]} radius={0.03} position={[-0.9, 0.225, -0.6]} rotation-y={0.4} material={M.wood} />
      <RoundedBox args={[0.45, 0.35, 0.45]} radius={0.03} position={[1.0, 0.175, 0.05]} rotation-y={-0.3} material={M.wood} />
      <MobileBase ref={robot} wheelsRef={wheels} lidarRef={lidar} scale={0.7}>
        <mesh material={M.scan} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[3.2, 40, Math.PI / 2 - 0.4, 0.8]} />
        </mesh>
      </MobileBase>
    </>
  )
}

/* ═════════ 프로젝트 03: OMX 모방학습 (리더 → 팔로워) ═════════ */
const OMX_KEYS = [
  key(0, -1.57, -0.15, 1.35, 0.9, 0),
  key(1.0, -1.0, 0.7, 1.3, DOWN, 0),
  key(1.7, -1.0, 1.1, 1.2, DOWN, 0),
  key(2.1, -1.0, 1.1, 1.2, DOWN, 1),
  key(2.8, -1.0, 0.7, 1.3, DOWN, 1),
  key(3.9, -2.1, 0.7, 1.3, DOWN, 1),
  key(4.6, -2.1, 1.1, 1.2, DOWN, 1),
  key(5.0, -2.1, 1.1, 1.2, DOWN, 0),
  key(5.7, -2.1, 0.6, 1.3, DOWN, 0),
  key(6.6, -1.57, -0.15, 1.35, 0.9, 0),
  key(7.2, -1.57, -0.15, 1.35, 0.9, 0),
]
const OS = 1.6, LX = -1.3, FX = 1.3, DELAY = 0.45

export function OmxScene() {
  const leader = useRef(), follower = useRef(), cube = useRef(), trail = useRef()
  const A = fk(SERVO, OMX_KEYS[2], OS), B = fk(SERVO, OMX_KEYS[6], OS)
  const tmp = useMemo(v3, [])
  const N = 90
  const hist = useMemo(() => Array.from({ length: N }, () => new THREE.Vector3(FX, 1, 0)), [])
  const flat = useMemo(() => new Float32Array(N * 3), [])
  const cable = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(LX + 0.3, 0.03, -0.3), new THREE.Vector3(LX + 1, 0.03, -0.9),
      new THREE.Vector3(FX - 1, 0.03, -0.9), new THREE.Vector3(FX - 0.3, 0.03, -0.3),
    ])
    return new THREE.TubeGeometry(c, 60, 0.025, 8, false)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    leader.current.apply(sampleLoop(OMX_KEYS, t))
    const ft = Math.max(0, t - DELAY)
    follower.current.apply(sampleLoop(OMX_KEYS, ft))
    follower.current.tipWorld(tmp)
    const c = ft % 7.2
    if (c < 2.05) cube.current.position.set(FX + A[0], A[1], A[2])
    else if (c < 4.95) cube.current.position.copy(tmp)
    else cube.current.position.set(FX + B[0], B[1], B[2])
    hist.pop()
    hist.unshift(tmp.clone())
    for (let i = 0; i < N; i++) {
      flat[i * 3] = hist[i].x
      flat[i * 3 + 1] = hist[i].y
      flat[i * 3 + 2] = hist[i].z
    }
    trail.current?.geometry.setPositions(flat)
  })

  const pad = (x, z, k) => (
    <RoundedBox key={k} args={[0.38, 0.012, 0.38]} radius={0.004} position={[x, 0.006, z]} material={M.graphite} />
  )

  return (
    <>
      <Cam position={[0, 3.0, 6.2]} target={[0, 0.55, 0.1]} fov={34} />
      <Studio shadowScale={10} far={3} />
      <RoundedBox args={[5.4, 0.16, 3.4]} radius={0.05} position-y={-0.08} material={M.slab} />
      <ArmRig ref={leader} variant="servo" paint={M.leader} led={M.ledViolet} scale={OS} position-x={LX} />
      <ArmRig ref={follower} variant="servo" led={M.ledViolet} scale={OS} position-x={FX} />
      <mesh geometry={cable} material={M.rubber} />
      {pad(LX + A[0], A[2], 'la')}
      {pad(LX + B[0], B[2], 'lb')}
      {pad(FX + A[0], A[2], 'fa')}
      {pad(FX + B[0], B[2], 'fb')}
      <RoundedBox ref={cube} args={[0.19, 0.19, 0.19]} radius={0.025} material={M.cube} />
      <Line ref={trail} points={hist} color="#9b6bff" lineWidth={2.5} transparent opacity={0.85} />
    </>
  )
}

/* ═════════ 메인: 자율주행 + 로봇팔 통합 ═════════ */
const MAIN_KEYS = [
  key(0, -1.57, -0.1, 1.5, 0.9, 0),
  key(1, -1.57, -0.1, 1.5, 0.9, 0),
  key(2.2, -Math.PI, 0.9, 1.05, DOWN, 0),
  key(2.7, -Math.PI, 0.9, 1.05, DOWN, 1),
  key(4, -1.57, -0.1, 1.5, 0.9, 1),
  key(9, -1.57, -0.1, 1.5, 0.9, 1),
  key(10.3, -Math.PI, 0.9, 1.05, DOWN, 1),
  key(10.8, -Math.PI, 0.9, 1.05, DOWN, 0),
  key(12, -1.57, -0.1, 1.5, 0.9, 0),
  key(16, -1.57, -0.1, 1.5, 0.9, 0),
]
const AX = -2.1, BX = 2.1, Z0 = -0.9, AS = 0.6

export function MainScene() {
  const body = useRef(), arm = useRef(), item = useRef(), wheels = useRef(), lidar = useRef()
  const [spot, setSpot] = useState(null)
  const tmp = useMemo(v3, [])

  useLayoutEffect(() => {
    body.current.position.set(AX, 0, Z0)
    arm.current.apply(MAIN_KEYS[2])
    arm.current.tipWorld(tmp)
    setSpot({ y: tmp.y - 0.08 * AS, dz: tmp.z - Z0, dx: tmp.x - AX })
  }, [tmp])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const c = t % 16
    let x = AX, v = 0
    if (c >= 4.5 && c < 9) { x = AX + (BX - AX) * smooth((c - 4.5) / 4.5); v = 1 }
    else if (c >= 9 && c < 12) x = BX
    else if (c >= 12) { x = BX + (AX - BX) * smooth((c - 12) / 4); v = -1 }
    const prev = body.current.position.x
    body.current.position.set(x, 0, Z0)
    const dx = x - prev
    wheels.current.children.forEach((w) => (w.rotation.x += dx / 0.17))
    lidar.current.rotation.y += Math.min(dt, 0.05) * 4
    arm.current.apply(sampleLoop(MAIN_KEYS, t))
    if (!spot) return
    const it = item.current
    if (c < 2.7) {
      it.position.set(AX + spot.dx, spot.y, Z0 + spot.dz)
      it.scale.setScalar(AS * smooth(clamp01(c / 0.5)))
    } else if (c < 10.8) {
      arm.current.tipWorld(tmp)
      it.position.set(tmp.x, tmp.y - 0.08 * AS, tmp.z)
      it.scale.setScalar(AS)
    } else {
      it.position.set(BX + spot.dx, spot.y, Z0 + spot.dz)
      it.scale.setScalar(AS * (1 - smooth(clamp01((c - 15.4) / 0.6))))
    }
    void v
  })

  const shelf = (cx, k, filled) =>
    spot && (
      <group key={k} position={[cx + spot.dx, 0, Z0 + spot.dz]}>
        <RoundedBox args={[2.0, 0.06, 0.6]} radius={0.02} position-y={spot.y - 0.03} material={M.wood} />
        {[-0.92, 0.92].map((sx) =>
          [-0.24, 0.24].map((sz) => (
            <mesh key={`${sx}${sz}`} material={M.graphite} position={[sx, (spot.y - 0.06) / 2, sz]}>
              <boxGeometry args={[0.05, spot.y - 0.06, 0.05]} />
            </mesh>
          ))
        )}
        {filled.map((ox) => (
          <Seedling key={ox} position={[ox, spot.y, 0]} scale={AS} />
        ))}
      </group>
    )

  return (
    <>
      <Cam position={[0, 3.6, 7.0]} target={[0, 0.6, 0]} fov={36} />
      <Studio shadowScale={14} far={3} />
      <RoundedBox args={[7.8, 0.2, 4.9]} radius={0.06} position-y={-0.1} material={M.slab} />
      <mesh material={M.led} position={[0, 0.003, Z0]}>
        <boxGeometry args={[BX - AX, 0.004, 0.025]} />
      </mesh>
      {shelf(AX, 'a', [-0.7, -0.35, 0.35, 0.7])}
      {shelf(BX, 'b', [-0.7, -0.35, 0.35, 0.7])}
      <group ref={body} rotation-y={Math.PI / 2}>
        <MobileBase wheelsRef={wheels} lidarRef={lidar} led={M.led} />
        <ArmRig ref={arm} variant="industrial" scale={AS} position={[0, 0.56, -0.25]} />
      </group>
      <Seedling ref={item} scale={AS} />
    </>
  )
}
