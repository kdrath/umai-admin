import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">UMAI Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/works" className="p-6 border rounded-lg hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">Works</h2>
          <p className="text-gray-600">Manage creative works and media</p>
        </a>
        <a href="/candidates" className="p-6 border rounded-lg hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">Candidates</h2>
          <p className="text-gray-600">Review and curate candidate works</p>
        </a>
        <a href="/sources" className="p-6 border rounded-lg hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">Sources</h2>
          <p className="text-gray-600">Manage source feeds and discovery</p>
        </a>
      </div>
    </div>
  )
}