import type { APIRoute } from 'astro'
import { type ShieldStyle, getShieldUrl, getSvg } from '/utils'

export const prerender = false

const icon_data = import.meta.env.DEV
  ? await import('@iconify-json/logos').then(m => m.icons)
  : await fetch(new URL('/icon_data.json', import.meta.env.SITE)).then(m => m.json())
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
  // @todo more friendly message
  return new Response(JSON.stringify({
    message: 'Please use the query params to build the badge',
    example: `${protocol}//${host}/short?name=javascript&style=for-the-badge&labelColor=light&isSvg=true`,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 400,
  })
}
