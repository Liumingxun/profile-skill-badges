import { getIconData, iconToHTML, iconToSVG, replaceIDs } from '@iconify/utils'
import { icons } from '@iconify-json/logos'
import { Base64 } from '.'

type ShieldStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'

export function getSvg(name: string, size = 'auto') {
  const data = getIconData(icons, name)!
  const built = iconToSVG(data, { height: size })
  return iconToHTML(replaceIDs(built.body), built.attributes)
}

export function getShieldUrl(keyword: string, svg: string, style: ShieldStyle = 'for-the-badge', labelColor: string = 'eff1f5', isSvg: boolean = true) {
  keyword = keyword
    .replaceAll('-icon', '')
    .replaceAll(/-/g, '%20')
    .replaceAll(/_/g, '__')
  return `https://img.shields.io/badge/${keyword}-${labelColor}${isSvg ? '.svg' : ''}`
    + `?style=${style}&logo=data:image/svg+xml;base64,${Base64.encode(svg)}`
}
