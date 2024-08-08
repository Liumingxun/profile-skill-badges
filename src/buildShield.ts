import { buildIcon, loadIcon } from 'iconify-icon'
import { Base64 } from '../utils'

type ShieldStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'

async function getSvgLocal(icon: string, size = '2em') {
  const data = await loadIcon(icon)
  const built = buildIcon(data, { height: size })
  const xlink = built.body.includes('xlink:') ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : ''
  return `<svg xmlns="http://www.w3.org/2000/svg"${xlink} ${Object.entries(built.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')}>${built.body}</svg>`
}

function buildShield(keyword: string, svg: string, style: ShieldStyle = 'for-the-badge', bgc: string = 'eff1f5', isSvg: boolean = true) {
  keyword = keyword
    .replaceAll('-icon', '')
    .replaceAll(/-/g, '%20')
    .replaceAll(/_/g, '__')
  return `https://img.shields.io/badge/${keyword}-${bgc}${isSvg ? '.svg' : ''}`
    + `?style=${style}&logo=data:image/svg+xml;base64,${Base64.encode(svg)}`
}

interface Badge {
  name: string
  svg: string
  url: string
  markdown: string
  html: string
}

export function buildBadge(keys: string | string[]) {
  if (typeof keys === 'string')
    keys = [keys]

  const build_list: Promise<Badge>[] = keys.map(async (key) => {
    const svg = await getSvgLocal(`logos:${key}`)
    const shield_url = buildShield(key, svg)
    return ({
      name: key,
      svg,
      url: shield_url,
      html: `<img src="${shield_url}" />`,
      markdown: `![${key}](${shield_url})`,
    })
  })

  return Promise.all(build_list)
}
