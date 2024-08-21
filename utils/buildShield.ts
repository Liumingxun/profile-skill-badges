import { getIconData, iconToHTML, iconToSVG, replaceIDs } from '@iconify/utils'
import type { IconifyJSON } from '@iconify-json/logos'
import { Base64 } from '.'

export type ShieldStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'

export function getSvg(name: string, icons: IconifyJSON, size = 'auto') {
  const data = getIconData(icons, name)!
  const built = iconToSVG(data, { height: size })
  return iconToHTML(replaceIDs(built.body), built.attributes)
}

export function getShieldUrl(name: string, svg: string, style: ShieldStyle = 'for-the-badge', labelColor: 'light' | 'dark' = 'dark', isSvg: boolean = true) {
  const keyword = name
    .replaceAll('-icon', '')
    .replaceAll(/-/g, '%20')
    .replaceAll(/_/g, '__')
  return `https://img.shields.io/badge/${keyword}-${labelColor === 'light' ? 'eff1f5' : '303446'}${isSvg ? '.svg' : ''}`
    + `?style=${style}&logo=data:image/svg+xml;base64,${Base64.encode(svg)}`
}
