import { useState } from 'react'
import type { User } from '../types'

type Props = { onSubmit: (u: Omit<User,'id'>) => void }

export default function UserForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  return (
    <form className="form" onSubmit={(e) => {
      e.preventDefault()
      onSubmit({ name, username, email })
      setName(''); setUsername(''); setEmail('')
    }}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required />
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
      <button type="submit">Add User</button>
    </form>
  )
}
