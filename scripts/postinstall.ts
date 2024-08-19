import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

const base = cwd()

async function copyIcons() {
  const iconDataPath = resolve(base, './public/icon_data.json')
  const iconKeysPath = resolve(base, './public/icon_keys.json')

  await copyFile(
    resolve(base, './node_modules/@iconify-json/logos/icons.json'),
    iconDataPath,
  )
  const icons = JSON.parse(await readFile(iconDataPath, 'utf-8'))
  const icon_keys = Object.keys(icons.icons)

  const duplicate_keys: string[] = []
  const pure_filter_keys = /(.*)-icon$/

  icon_keys.forEach((key) => {
    const matches = key.match(pure_filter_keys)
    if (matches)
      duplicate_keys.push(matches[1])
  })

  const filtered_icon_keys = icon_keys.filter((key) => {
    return !duplicate_keys.includes(key) && !icons.icons[key].hidden
  })

  await writeFile(iconKeysPath, JSON.stringify(filtered_icon_keys))
  await writeFile(iconDataPath, JSON.stringify(icons))
}

copyIcons()
