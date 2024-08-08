import { readFileSync, writeFileSync } from 'node:fs'
import { icons } from '@iconify-json/logos'
import { buildBadge } from './buildShield'

const icon_keys = Object.keys(icons.icons)

const pure_filter_keys = /(.*)-icon$/
const duplicate_keys: string[] = []

icon_keys.forEach((key) => {
  const matches = key.match(pure_filter_keys)
  if (matches)
    duplicate_keys.push(matches[1])
})

const filtered_icon_keys = icon_keys.filter((key) => {
  return !duplicate_keys.includes(key)
})

const updated_badges = readFileSync('./README.md').toString()
  .replace(/## Badges\n(.*)/, `## Badges\n\n${(await buildBadge(filtered_icon_keys, 'Markdown')).join('\n')}`)

writeFileSync('./README.md', updated_badges)
