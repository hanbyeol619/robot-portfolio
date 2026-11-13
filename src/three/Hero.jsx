import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Sparkles, Trail } from '@react-three/drei'
import { EffectComposer, Bloom, N8AO, Noise, Vignette, SMAA } from '@react-three/postprocessing'
import { M, lathe, ACCENT } from './materials'
import { Studio, Cam, Seedling, ArmRig, IND } from './parts'
import { key, DOWN, sampleAt, fk, smooth, clamp01 } from './kin'

const BG = '#ecedef'
const FONT = `${import.meta.env.BASE_URL}fonts/SpaceGrotesk-Bold.woff`
const POT = [[0, 0], [0.24, 0], [0.27, 0.03], [0.32, 0.4], [0.34, 0.42], [0.34, 0.45], [0.31, 0.45], [0.29, 0.42], [0, 0.42]]

// 스크롤 진행도(0~10)에 따른 로봇팔 동작
const KEYS = [
  key(0, -1.57, -0.12, 1.55, 1.0, 1),
  key(2.5, -0.95, 0.05, 0.45, 0.35, 1),
  key(5, -1.57, 0.5, 0.62, 0.5, 1),
  key(7.5, -2.5, 0.35, 1.15, DOWN, 1),
  key(9.2, -2.95, 0.8, 1.05, DOWN, 1),
  key(10, -2.95, 0.8, 1.05, DOWN, 0),
]
const SLEEP = { yaw: -1.57, sh: -0.05, el: 2.35, wr: 1.55, g: 1 }
const lerpPose = (a, b, t) => ({
  yaw: a.yaw + (b.yaw - a.yaw) * t, sh: a.sh + (b.sh - a.sh) * t, el: a.el + (b.el - a.el) * t,
  wr: a.wr + (b.wr - a.wr) * t, g: a.g + (b.g - a.g) * t,
})

function useGlobalPointer() {
  const p = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const on = (e) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1
      p.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])
  return p
}

// 카메라에 붙어 있는 큰 글씨: 항상 화면 안에 들어오고, 로봇팔은 그 앞을 지나가요
function BigType({ progress, wide, boot }) {
  const { camera, size } = useThree()
  const group = useRef(), a = useRef(), b = useRef()
  const D = 14
  const h = D * Math.tan(THREE.MathUtils.degToRad(15))
  const hw = h * (size.width / size.height)
  const fs = wide ? Math.min(hw * 0.36, h * 0.42) : hw * 0.36
  const margin = hw * 0.06
  const top = h * (wide ? 0.74 : 0.7)

  useFrame(() => {
    const t = smooth(clamp01(boot.current))
    const g = group.current
    g.position.copy(camera.position)
    g.quaternion.copy(camera.quaternion)
    g.translateZ(-D)
    g.translateY((1 - t) * -0.8 + progress.current * h * 0.5)
    if (a.current) a.current.fillOpacity = t
    if (b.current) b.current.outlineOpacity = t
  })

  return (
    <group ref={group}>
      <Text ref={a} font={FONT} fontSize={fs} anchorX="left" anchorY="top" position={[-hw + margin, top, 0]} letterSpacing={-0.045} color="#0e0f11">
        ROBOTS
      </Text>
      <Text
        ref={b}
        font={FONT}
        fontSize={fs}
        anchorX="right"
        anchorY="top"
        textAlign="right"
        position={[hw - margin, top - fs * 0.9, 0]}
        letterSpacing={-0.045}
        lineHeight={0.9}
        fillOpacity={0}
        outlineWidth={fs * 0.012}
        outlineColor="#0e0f11"
        color="#0e0f11"
      >
        {wide ? 'FOR PEOPLE' : 'FOR\nPEOPLE'}
      </Text>
    </group>
  )
}

function TipTrail({ target }) {
  return (
    <Trail width={1.6} length={5} color={ACCENT} attenuation={(w) => w * w} decay={1.2} target={target} />
  )
}

function Scene({ progress, bootDelay, reduce }) {
  const arm = useRef(), plant = useRef(), group = useRef(), dot = useRef()
  const p = useRef(0)
  const boot = useRef(reduce ? 1 : 0)
  const start = useRef(null)
  const placedAt = useRef(null)
  const pointer = useGlobalPointer()
  const sp = useRef({ x: 0, y: 0 })
  const { size } = useThree()
  const wide = size.width / size.height > 1.15
  const mobile = size.width < 768
  const led = useMemo(() => M.led.clone(), [])
  const tipF = fk(IND, KEYS[KEYS.length - 1])
  const plugY = tipF[1] - 0.08, soilTop = plugY + 0.12, potBase = soilTop - 0.4
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const [trail, setTrail] = useState(false)

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (start.current === null) start.current = t + bootDelay
    if (!reduce) boot.current = clamp01((t - start.current) / 2.4)
    const b = smooth(boot.current)
    if (!trail && boot.current >= 1) setTrail(true)
    led.emissiveIntensity = 0.2 + b * 2.6 + Math.sin(t * 3) * 0.25 * b

    p.current += (progress.current - p.current) * (1 - Math.exp(-dt * 6))
    const c = p.current * 10
    let pose = { ...sampleAt(KEYS, c) }

    // 마우스를 바라보는 동작 (첫 화면 근처에서만)
    sp.current.x += (pointer.current.x - sp.current.x) * (1 - Math.exp(-dt * 3))
    sp.current.y += (pointer.current.y - sp.current.y) * (1 - Math.exp(-dt * 3))
    const look = reduce ? 0 : (1 - smooth(clamp01(c / 2))) * b
    pose.yaw += sp.current.x * 0.45 * look
    pose.wr -= sp.current.y * 0.35 * look
    pose.sh += sp.current.y * -0.08 * look

    const idle = reduce ? 0 : 1 - smooth(clamp01((c - 8.4) / 0.8))
    pose.yaw += Math.sin(t * 0.55) * 0.03 * idle
    pose.wr += Math.sin(t * 0.8) * 0.04 * idle
    pose = lerpPose(SLEEP, pose, b)
    arm.current.apply(pose)

    arm.current.tipWorld(tmp)
    group.current.worldToLocal(tmp)
    dot.current.position.copy(tmp)
    if (c < 9.6) {
      plant.current.position.set(tmp.x, tmp.y - 0.08, tmp.z)
      plant.current.scale.setScalar(1)
      placedAt.current = null
    } else {
      if (placedAt.current === null) placedAt.current = t
      const g = reduce ? 1 : smooth(clamp01((t - placedAt.current) / 1.4))
      plant.current.position.set(tipF[0], plugY, tipF[2])
      plant.current.scale.set(1 + g * 0.35, 1 + g * 0.9, 1 + g * 0.35)
    }
  })

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 11, 26]} />
      <Cam
        position={[0, 2.7, 10]}
        target={[0, 1.75, 0]}
        fov={30}
        sway={reduce ? 0 : 0.3}
        fitAspect={0}
        getOrbit={() => ({
          a: -0.35 + p.current * 0.85,
          y: p.current * 0.6,
          d: (wide ? 1 : 1.3) * (1 + (1 - smooth(boot.current)) * 0.35),
          lx: wide ? -1.2 : 0,
        })}
      />
      <Studio shadowScale={14} far={5} shadowOpacity={0.55} intensity={0.75} />
      <spotLight position={[3, 9, 4]} angle={0.5} penumbra={1} intensity={18} color="#fff4ea" />
      <BigType progress={p} wide={wide} boot={boot} />
      {!reduce && <Sparkles count={mobile ? 30 : 70} scale={[9, 5, 6]} position={[0, 2.2, 0]} size={2.2} speed={0.25} opacity={0.7} color={ACCENT} />}

      <group ref={group}>
        <ArmRig ref={arm} variant="industrial" led={led} />
        <Seedling ref={plant} />
        <mesh ref={dot} visible={false}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
        {trail && !reduce && <TipTrail target={dot} />}
        <group position={[tipF[0], 0, tipF[2]]}>
          <mesh material={M.slabDark} position-y={potBase / 2}>
            <cylinderGeometry args={[0.36, 0.4, potBase, 48]} />
          </mesh>
          <mesh geometry={lathe(POT)} material={M.ceramic} position-y={potBase} />
          <mesh material={M.soil} position-y={soilTop - 0.01}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
          </mesh>
        </group>
      </group>

      <mesh rotation-x={-Math.PI / 2} position-y={-0.001}>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color="#cfd1d5" roughness={0.9} />
      </mesh>

      <EffectComposer multisampling={0} disableNormalPass={false}>
        {!mobile && <N8AO aoRadius={0.6} intensity={2.2} distanceFalloff={0.6} />}
        <Bloom mipmapBlur luminanceThreshold={1.15} intensity={0.7} radius={0.55} />
        <SMAA />
        <Noise opacity={0.028} premultiply />
        <Vignette offset={0.32} darkness={0.42} />
      </EffectComposer>
    </>
  )
}

export default function HeroCanvas({ progress, bootDelay = 0 }) {
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  return (
    <Canvas className="hero-canvas" dpr={[1, 1.75]} gl={{ antialias: false, powerPreference: 'high-performance' }}>
      <Suspense fallback={null}>
        <Scene progress={progress} bootDelay={bootDelay} reduce={reduce} />
      </Suspense>
    </Canvas>
  )
}
