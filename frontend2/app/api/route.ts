import { headers } from 'next/headers'
 
export async function GET(request: Request) {
  const headersList = headers()
  const referer = headersList.get('referer')
  if (!referer?.includes(process.env.APP_URL as string)) {
    return Response.json({ 
      message: 'Unauthorized',
      ref:referer
     }, { status: 401 });
  }
 
  return Response.json({ message: referer})
}

