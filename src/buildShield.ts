import { buildIcon, loadIcon } from 'iconify-icon'
import { Base64 } from '../utils'

type BadgeType = 'Markdown' | 'HTML' | 'URL'
type ShieldStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'

async function getSvgLocal(icon: string, size = '1em') {
  const data = await loadIcon(icon)
  const built = buildIcon(data, { height: size })
  const xlink = built.body.includes('xlink:') ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : ''
  return `<svg xmlns="http://www.w3.org/2000/svg"${xlink} ${Object.entries(built.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')}>${built.body}</svg>`
}

function buildShield(keyword: string, svg: string, style: ShieldStyle = 'for-the-badge', bgc: string = 'eff1f5', isSvg: boolean = true) {
  keyword = keyword.replaceAll(/ /g, '%20').replaceAll(/-/g, '--').replaceAll(/_/g, '__')
  return `https://img.shields.io/badge/${keyword}-${bgc}${isSvg ? '.svg' : ''}`
    + `?style=${style}&logo=data:image/svg+xml;base64,${Base64.encode(svg)}`
}

export function buildBadge(keys: string | string[], type: BadgeType = 'URL') {
  if (typeof keys === 'string')
    keys = [keys]

  let build_list: Promise<string>[]
  if (type === 'URL') {
    build_list = keys.map(async key => buildShield(key, await getSvgLocal(`logos:${key}`)))
  }
  else if (type === 'HTML') {
    build_list = keys.map(async (key) => {
      const shield_url = buildShield(key, await getSvgLocal(`logos:${key}`))
      return `<img src="${shield_url}" />`
    })
  }
  else {
    build_list = keys.map(async (key) => {
      const shield_url = buildShield(key, await getSvgLocal(`logos:${key}`))
      return `![${key}](${shield_url})`
    })
  }
  return Promise.all(build_list)
}
