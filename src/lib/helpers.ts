import * as THREE from 'three'

export const chopString = (s: string): String[] => {
  return []
}

export function stopGoEased(x: number, downtime: number, period: number) {
  const cycle = (x / period) | 0
  const tween = x - cycle * period
  const linStep = easeInOutCubic(linearStep(tween, downtime, period))
  return cycle + linStep
}

export function linearStep(x: number, edge0: number, edge1: number) {
  const w = edge1 - edge0
  const m = 1 / w
  const y0 = -m * edge0
  return THREE.MathUtils.clamp(y0 + m * x, 0, 1)
}

export function easeInOutCubic(x: number) {
  return x ** 2 * 3 - x ** 3 * 2
}
