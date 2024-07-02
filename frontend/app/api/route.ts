import { headers } from 'next/headers'
import { encrypt, decrypt } from './encryption';
export async function GET(request: Request) {
  const headersList = headers()
  const referer = headersList.get('referer')
  if (!referer?.includes(process.env.APP_URL as string)) {
    return Response.json({ 
      message: 'Unauthorized',
      ref:referer
     }, { status: 401 });
  }
 
   return Response.json({ message: "no get return" });

}

export async function POST(request: Request) {
  
  const headersList = headers()
  const referer = headersList.get('referer')
  if (!referer?.includes(process.env.APP_URL as string)) {
    return Response.json({ 
      message: 'Unauthorized',
      ref:referer
     }, { status: 401 });
  }

  const { data, action } = await request.json();
  switch (action) {
    case 'encrypt':
      return Response.json({ encryptedData: encrypt(data) });
    case 'decrypt':
      console.log("decrypt API call")
      return Response.json({ decryptedData: decrypt(data as string) });
    default:
      return Response.json({ message: 'Invalid action' });
  }
}





// const allowedOrigin = process.env.APP_URL;

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const origin = req.headers.origin;

//   if (origin !== allowedOrigin) {
//     res.status(403).json({ message: 'Forbidden' });
//     return;
//   }

//   // Exemple d'utilisation des fonctions d'encryptage
//   if (req.method === 'POST') {
//     const { data } = req.body;
//     const encryptedData = encrypt(JSON.stringify(data));
//     res.status(200).json({ encryptedData });
//   } else if (req.method === 'GET') {
//     const { encryptedData } = req.query;
//     const decryptedData = decrypt(encryptedData as string);
//     res.status(200).json({ decryptedData: JSON.parse(decryptedData) });
//   } else {
//     const { encryptedData } = req.query;
//     console.log(encryptedData)
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

