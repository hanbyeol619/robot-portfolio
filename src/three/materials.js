import * as THREE from 'three'

export const ACCENT = '#ff5a1f'

export const M = {
  paint: new THREE.MeshPhysicalMaterial({ color: '#f1f2f4', roughness: 0.26, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.1 }),
  leader: new THREE.MeshPhysicalMaterial({ color: '#40454d', roughness: 0.32, metalness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
  graphite: new THREE.MeshStandardMaterial({ color: '#2b2f35', roughness: 0.38, metalness: 0.6 }),
  dark: new THREE.MeshStandardMaterial({ color: '#191b1f', roughness: 0.5, metalness: 0.35 }),
  steel: new THREE.MeshStandardMaterial({ color: '#cfd4da', roughness: 0.18, metalness: 1 }),
  rubber: new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.92 }),
  accent: new THREE.MeshPhysicalMaterial({ color: ACCENT, roughness: 0.3, clearcoat: 0.8 }),
  led: new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 2.4, toneMapped: false }),
  ledBlue: new THREE.MeshStandardMaterial({ color: '#3d8bff', emissive: '#3d8bff', emissiveIntensity: 2.4, toneMapped: false }),
  ledViolet: new THREE.MeshStandardMaterial({ color: '#9b6bff', emissive: '#9b6bff', emissiveIntensity: 2.4, toneMapped: false }),
  soil: new THREE.MeshStandardMaterial({ color: '#4b372a', roughness: 1 }),
  leaf: new THREE.MeshPhysicalMaterial({ color: '#4c9a52', roughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color('#b9f0a8') }),
  ceramic: new THREE.MeshPhysicalMaterial({ color: '#e4e5e7', roughness: 0.35, clearcoat: 0.6 }),
  tray: new THREE.MeshStandardMaterial({ color: '#23262b', roughness: 0.7, metalness: 0.1 }),
  slab: new THREE.MeshStandardMaterial({ color: '#dcdee1', roughness: 0.85 }),
  slabDark: new THREE.MeshStandardMaterial({ color: '#c9ccd0', roughness: 0.9 }),
  asphalt: new THREE.MeshStandardMaterial({ color: '#2a2d32', roughness: 0.95, side: THREE.DoubleSide }),
  lane: new THREE.MeshStandardMaterial({ color: '#f5f6f7', roughness: 0.6, side: THREE.DoubleSide }),
  cone: new THREE.MeshPhysicalMaterial({ color: ACCENT, roughness: 0.4, clearcoat: 0.5 }),
  cube: new THREE.MeshPhysicalMaterial({ color: '#9b6bff', roughness: 0.25, clearcoat: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: '#b9b2a6', roughness: 0.8 }),
  scan: new THREE.MeshBasicMaterial({ color: '#3d8bff', transparent: true, opacity: 0.13, depthWrite: false, side: THREE.DoubleSide }),
}

const latheCache = new Map()
export function lathe(points, seg = 64) {
  const k = JSON.stringify(points)
  if (!latheCache.has(k)) latheCache.set(k, new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), seg))
  return latheCache.get(k)
}
