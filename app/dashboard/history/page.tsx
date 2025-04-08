"use client"
import { useEffect, useState } from "react"

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history", {
          method: "GET",
          credentials: "include", // 🔥 super important
        })

        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error || "Failed to fetch history")
        }

        const { history } = await res.json()
        setHistory(history)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const handleDelete = async (postId: string) => {
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ postId }),
    })

    if (!res.ok) {
      const { error } = await res.json()
      alert("Failed to delete: " + error)
      return
    }

    // remove post from local state
    setHistory((prev) => prev.filter((item: any) => item.id !== postId))
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Your History</h2>
      {history.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item: any) => (
            <li key={item.id} className="p-4 border rounded bg-gray-100">
              <p className="text-sm text-gray-600">Type: {item.type}</p>
              <p className="mt-1 font-medium">Prompt: {item.input}</p>
              <p className="mt-1">Result: {item.output}</p>

              <button
                onClick={() => handleDelete(item.id)}
                className="mt-2 text-red-500 text-sm underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

