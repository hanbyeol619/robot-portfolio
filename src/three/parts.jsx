import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Environment, Lightformer, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { M, lathe } from './materials'

/* ───────── 조명 · 스튜디오 ───────── */
export function Studio({ shadowScale = 12, shadowOpacity = 0.55, shadowY = 0, far = 4 }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 8, 5]} intensity={1.6} />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} color="#dfe8ff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={2} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[6, 2, -2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#ffd9c7" position={[2, 3, 6]} scale={3} />
        <Lightformer form="rect" intensity={0.6} position={[0, -2, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} color="#e9eaec" />
      </Environment>
      <ContactShadows position={[0, shadowY + 0.002, 0]} scale={shadowScale} resolution={512} blur={2.4} far={far} opacity={shadowOpacity} color="#23262b" frames={Infinity} />
    </>
  )
}

/* 카메라: 기본 위치 + 마우스에 살짝 반응 */
export function Cam({ position, target, fov = 32, sway = 0.25, getOrbit, fitAspect = 1.3 }) {
  const ref = useRef()
  const look = useMemo(() => new THREE.Vector3(...target), [target])
  const base = useMemo(() => new THREE.Vector3(...position), [position])
  const off = useMemo(() => base.clone().sub(look), [base, look])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const { pointer, size } = useThree()
  useFrame((_, dt) => {
    const c = ref.current
    if (!c) return
    const extra = getOrbit ? getOrbit() : { a: 0, y: 0, d: 1, lx: 0, ly: 0 }
    const a = extra.a + pointer.x * sway * 0.4
    const fit = Math.max(1, Math.min(1.7, fitAspect / Math.max(0.3, size.width / size.height)))
    tmp.copy(off).multiplyScalar(extra.d * fit)
    tmp.applyAxisAngle(THREE.Object3D.DEFAULT_UP, a)
    tmp.y += extra.y + pointer.y * sway * 0.6
    tmp.add(look)
    c.position.lerp(tmp, 1 - Math.exp(-dt * 4))
    c.lookAt(look.x + (extra.lx || 0), look.y + (extra.ly || 0), look.z)
  })
  return <PerspectiveCamera ref={ref} makeDefault position={position} fov={fov} near={0.1} far={100} />
}

/* ───────── 모종 · 화분 ───────── */
export const Seedling = forwardRef(function Seedling({ scale = 1, plug = true, ...props }, ref) {
  return (
    <group ref={ref} scale={scale} {...props}>
      {plug && (
        <mesh material={M.soil} position-y={0.08}>
          <cylinderGeometry args={[0.085, 0.068, 0.16, 20]} />
        </mesh>
      )}
      <mesh material={M.leaf} position-y={0.27}>
        <cylinderGeometry args={[0.013, 0.018, 0.24, 8]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <group key={i} position-y={0.37 + i * 0.03} rotation-y={(i * Math.PI * 2) / 3 + 0.4}>
          <mesh material={M.leaf} position={[0.075, 0.01, 0]} rotation-z={-0.35} scale={[1, 0.22, 0.55]}>
            <sphereGeometry args={[0.085, 16, 10]} />
          </mesh>
        </group>
      ))}
    </group>
  )
})

const POT_PROFILE = [[0, 0], [0.13, 0], [0.15, 0.02], [0.19, 0.2], [0.205, 0.215], [0.205, 0.235], [0.185, 0.235], [0.17, 0.21], [0, 0.21]]
export const PottedPlant = forwardRef(function PottedPlant(props, ref) {
  return (
    <group ref={ref} {...props}>
      <mesh geometry={lathe(POT_PROFILE)} material={M.ceramic} />
      <mesh material={M.soil} position-y={0.2}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 24]} />
      </mesh>
      <Seedling position-y={0.08} scale={0.9} />
    </group>
  )
})

/* ───────── 로봇팔 ───────── */
export const IND = { H0: 0.95, L1: 1.5, L2: 1.3, L3: 0.55, gOpen: 0.16, gClose: 0.11 }
export const SERVO = { H0: 0.42, L1: 0.55, L2: 0.5, L3: 0.28, gOpen: 0.11, gClose: 0.077 }

const BASE_PROFILE = [[0, 0], [0.64, 0], [0.64, 0.05], [0.58, 0.11], [0.5, 0.16], [0, 0.16]]
const TURRET_PROFILE = [[0, 0], [0.47, 0], [0.47, 0.05], [0.44, 0.12], [0.38, 0.48], [0.33, 0.6], [0, 0.6]]

function Hub({ r, len, mat = M.graphite, cap = M.steel, ring }) {
  return (
    <group>
      <mesh material={mat} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[r, r, len, 40]} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} material={cap} rotation-x={Math.PI / 2} position-z={(s * len) / 2}>
          <cylinderGeometry args={[r * 0.72, r * 0.72, 0.02, 32]} />
        </mesh>
      ))}
      {ring && (
        <mesh material={ring} position-z={len / 2 + 0.012}>
          <torusGeometry args={[r * 0.82, 0.012, 8, 40]} />
        </mesh>
      )}
    </group>
  )
}

export const ArmRig = forwardRef(function ArmRig({ variant = 'industrial', paint = M.paint, led = M.led, scale = 1, ...props }, ref) {
  const d = variant === 'industrial' ? IND : SERVO
  const yaw = useRef(), sh = useRef(), el = useRef(), wr = useRef(), fl = useRef(), fr = useRef(), tip = useRef()
  useImperativeHandle(ref, () => ({
    dims: d,
    scale,
    apply(p) {
      yaw.current.rotation.y = p.yaw
      sh.current.rotation.z = -p.sh
      el.current.rotation.z = -p.el
      wr.current.rotation.z = -p.wr
      const x = d.gOpen - (d.gOpen - d.gClose) * p.g
      fl.current.position.x = -x
      fr.current.position.x = x
    },
    tipWorld(v) {
      tip.current.updateWorldMatrix(true, false)
      return tip.current.getWorldPosition(v)
    },
  }))

  const cable = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0.05, 0.12), new THREE.Vector3(-0.27, d.L1 * 0.35, 0.12),
      new THREE.Vector3(-0.27, d.L1 * 0.7, 0.12), new THREE.Vector3(-0.2, d.L1 - 0.05, 0.12),
    ])
    return new THREE.TubeGeometry(c, 40, 0.024, 10, false)
  }, [d.L1])

  if (variant === 'industrial') {
    return (
      <group scale={scale} {...props}>
        <mesh geometry={lathe(BASE_PROFILE)} material={M.graphite} />
        <group ref={yaw} position-y={0.16}>
          <mesh geometry={lathe(TURRET_PROFILE)} material={paint} />
          <mesh material={M.accent} position-y={0.03}>
            <cylinderGeometry args={[0.475, 0.475, 0.04, 48]} />
          </mesh>
          <RoundedBox args={[0.58, 0.36, 0.6]} radius={0.1} smoothness={4} position-y={0.66} material={paint} />
          <group ref={sh} position-y={d.H0 - 0.16}>
            <Hub r={0.27} len={0.72} ring={led} />
            <RoundedBox args={[0.34, d.L1 + 0.24, 0.4]} radius={0.13} smoothness={5} position-y={d.L1 / 2} material={paint} />
            <RoundedBox args={[0.36, d.L1 * 0.36, 0.26]} radius={0.04} smoothness={3} position-y={d.L1 * 0.52} material={M.graphite} />
            <mesh material={M.accent} position={[0, d.L1 * 0.78, 0.201]}>
              <boxGeometry args={[0.2, 0.05, 0.01]} />
            </mesh>
            <mesh geometry={cable} material={M.rubber} />
            <group ref={el} position-y={d.L1}>
              <Hub r={0.22} len={0.58} />
              <RoundedBox args={[0.27, d.L2 + 0.12, 0.31]} radius={0.1} smoothness={5} position-y={d.L2 / 2} material={paint} />
              <mesh material={M.graphite} position-y={d.L2 * 0.82}>
                <cylinderGeometry args={[0.16, 0.16, 0.2, 32]} />
              </mesh>
              <group ref={wr} position-y={d.L2}>
                <Hub r={0.15} len={0.4} ring={led} />
                <mesh material={M.steel} position-y={0.13}>
                  <cylinderGeometry args={[0.11, 0.12, 0.12, 32]} />
                </mesh>
                <mesh material={led} position-y={0.2} rotation-x={Math.PI / 2}>
                  <torusGeometry args={[0.11, 0.01, 8, 40]} />
                </mesh>
                <RoundedBox args={[0.42, 0.14, 0.24]} radius={0.035} smoothness={3} position-y={0.27} material={M.graphite} />
                {[fl, fr].map((r, i) => (
                  <group key={i} ref={r} position-y={0.46}>
                    <mesh material={M.steel}>
                      <boxGeometry args={[0.05, 0.27, 0.12]} />
                    </mesh>
                    <mesh material={M.rubber} position={[i ? -0.028 : 0.028, -0.06, 0]}>
                      <boxGeometry args={[0.012, 0.13, 0.1]} />
                    </mesh>
                  </group>
                ))}
                <object3D ref={tip} position-y={d.L3} />
              </group>
            </group>
          </group>
        </group>
      </group>
    )
  }

  // 서보형 (OMX 스타일 소형 로봇팔)
  return (
    <group scale={scale} {...props}>
      <RoundedBox args={[0.5, 0.06, 0.5]} radius={0.02} position-y={0.03} material={M.dark} />
      <RoundedBox args={[0.2, 0.26, 0.17]} radius={0.02} position-y={0.19} material={M.graphite} />
      <group ref={yaw} position-y={0.33}>
        <mesh material={M.steel} position-y={0.01}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
        </mesh>
        <RoundedBox args={[0.14, 0.08, 0.22]} radius={0.015} position-y={0.05} material={paint} />
        <group ref={sh} position-y={d.H0 - 0.33}>
          <RoundedBox args={[0.17, 0.2, 0.2]} radius={0.02} material={M.graphite} />
          <mesh material={led} position-z={0.101}>
            <boxGeometry args={[0.03, 0.03, 0.005]} />
          </mesh>
          <RoundedBox args={[0.1, d.L1, 0.12]} radius={0.03} position-y={d.L1 / 2} material={paint} />
          <group ref={el} position-y={d.L1}>
            <RoundedBox args={[0.16, 0.19, 0.19]} radius={0.02} material={M.graphite} />
            <RoundedBox args={[0.09, d.L2, 0.11]} radius={0.03} position-y={d.L2 / 2} material={paint} />
            <group ref={wr} position-y={d.L2}>
              <RoundedBox args={[0.15, 0.17, 0.17]} radius={0.02} material={M.graphite} />
              <RoundedBox args={[0.24, 0.07, 0.13]} radius={0.015} position-y={0.12} material={M.dark} />
              {[fl, fr].map((r, i) => (
                <group key={i} ref={r} position-y={0.21}>
                  <mesh material={paint}>
                    <boxGeometry args={[0.03, 0.13, 0.09]} />
                  </mesh>
                </group>
              ))}
              <object3D ref={tip} position-y={d.L3} />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
})

/* ───────── 자율주행 베이스 ───────── */
export const MobileBase = forwardRef(function MobileBase({ led = M.ledBlue, wheelsRef, lidarRef, children, ...props }, ref) {
  return (
    <group ref={ref} {...props}>
      <RoundedBox args={[1.0, 0.34, 1.3]} radius={0.1} smoothness={4} position-y={0.33} material={M.graphite} />
      <RoundedBox args={[0.94, 0.08, 1.22]} radius={0.04} smoothness={3} position-y={0.52} material={M.paint} />
      <RoundedBox args={[1.02, 0.1, 0.12]} radius={0.04} position={[0, 0.24, 0.62]} material={M.rubber} />
      <mesh material={led} position={[0, 0.4, 0.651]}>
        <boxGeometry args={[0.7, 0.03, 0.01]} />
      </mesh>
      <mesh material={led} position={[0, 0.4, -0.651]}>
        <boxGeometry args={[0.3, 0.03, 0.01]} />
      </mesh>
      <group ref={wheelsRef}>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.53, 0.17, 0.1]}>
            <mesh material={M.rubber} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.17, 0.17, 0.1, 32]} />
            </mesh>
            <mesh material={M.steel} rotation-z={Math.PI / 2} position-x={s * 0.051}>
              <cylinderGeometry args={[0.08, 0.08, 0.01, 6]} />
            </mesh>
          </group>
        ))}
      </group>
      {[-1, 1].map((s) => (
        <mesh key={s} material={M.steel} position={[s * 0.3, 0.06, -0.48]}>
          <sphereGeometry args={[0.06, 16, 12]} />
        </mesh>
      ))}
      <mesh material={M.dark} position={[0, 0.6, 0.38]}>
        <cylinderGeometry args={[0.12, 0.13, 0.08, 32]} />
      </mesh>
      <group ref={lidarRef} position={[0, 0.68, 0.38]}>
        <mesh material={M.graphite}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 32]} />
        </mesh>
        <mesh material={led} position={[0, 0, 0.1]}>
          <boxGeometry args={[0.05, 0.02, 0.005]} />
        </mesh>
        {children}
      </group>
    </group>
  )
})
