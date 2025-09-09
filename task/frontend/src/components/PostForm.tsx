import { useState } from 'react'
import type { Post, User } from '../types'

type Props = {
  onSubmit: (p: Omit<Post,'id'>) => void
  users: User[]
  defaultUserId?: number
}

export default function PostForm({ onSubmit, users, defaultUserId }: Props) {
  const [userId, setUserId] = useState<number | ''>(defaultUserId ?? '')
  const [title, setTitle] = useState('')

  return (
    <form className="form" onSubmit={(e) => {
      e.preventDefault()
      if (userId === '') return
      onSubmit({ userId, title })
      setTitle('')
    }}>
      <select value={userId} onChange={e=>setUserId(Number(e.target.value))} required>
        <option value="" disabled>Select User</option>
        {users.map(u => <option key={u.id} value={u.id}>{u.id} — {u.username}</option>)}
      </select>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Post title" required />
      <button type="submit">Add Post</button>
    </form>
  )
}
