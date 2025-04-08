// src/app/profile/page.tsx
"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [email, setEmail] = useState("")
  const [count, setCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login') // or your auth page
        return
      }

      setEmail(user.email || "")

      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setCount(count || 0)
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <h2 className="text-3xl font-bold mb-6">User Profile</h2>

      <p className="mb-2"><strong>Email:</strong> {email}</p>
      <p className="mb-6"><strong>Posts Generated:</strong> {count}</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Sign Out
      </button>
    </div>
  )
}
