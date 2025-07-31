import { redirect } from 'next/navigation'
import { getSession } from '@auth0/nextjs-auth0'

export default async function Home() {
  const session = await getSession()
  
  if (session) {
    // ログイン済みの場合はダッシュボードへ
    redirect('/chat')
  } else {
    // 未ログインの場合はAuth0ログインページへ
    redirect('/api/auth/login')
  }
}