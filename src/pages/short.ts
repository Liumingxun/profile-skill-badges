import type { APIRoute } from 'astro'
import { type ShieldStyle, getShieldUrl, getSvg } from '/utils'

export const prerender = false

const icon_data = await import('@iconify-json/logos').then(m => m.icons)
export const GET: APIRoute = async ({ request: { url } }) => {
  const { searchParams: query, host, protocol } = new URL(url)
  if (query.get('name')) {
    return Response.redirect(
      getShieldUrl(
        query.get('name')!,
        getSvg(query.get('name')!, icon_data),
        query.get('style')?.toString() as ShieldStyle,
        query.get('labelColor')?.toString() as 'light' | 'dark',
        query.get('isSvg')?.toString() === 'true',
      ),
      302,
    )
  }
  return Response.redirect(`${protocol}//${host}`, 302)
}
