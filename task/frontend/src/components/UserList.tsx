import { useState } from 'react'
import type { User } from '../types'

type Props = {
  users: User[]
  selectedUserId: number | null
  onSelect: (id: number) => void
  onUpdate: (id: number, u: Partial<User>) => void
  onDelete: (id: number) => void
}

export default function UserList({ users, selectedUserId, onSelect, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<User>>({})

  return (
    <table className="table" id="users">
      <thead><tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th><th>Actions</th></tr></thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id} className={selectedUserId===u.id ? 'row-selected' : ''} onClick={() => onSelect(u.id)}>
            <td>{u.id}</td>
            <td>{editingId===u.id ? <input defaultValue={u.name} onChange={e=>setDraft(d=>({...d, name:e.target.value}))}/> : u.name}</td>
            <td>{editingId===u.id ? <input defaultValue={u.username} onChange={e=>setDraft(d=>({...d, username:e.target.value}))}/> : u.username}</td>
            <td>{editingId===u.id ? <input defaultValue={u.email} onChange={e=>setDraft(d=>({...d, email:e.target.value}))}/> : u.email}</td>
            <td>
              {editingId===u.id ? (
                <>
                  <button onClick={(e)=>{e.stopPropagation(); onUpdate(u.id,draft); setEditingId(null); setDraft({})}}>Save</button>
                  <button onClick={(e)=>{e.stopPropagation(); setEditingId(null); setDraft({})}}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={(e)=>{e.stopPropagation(); setEditingId(u.id)}}>Edit</button>
                  <button onClick={(e)=>{e.stopPropagation(); onDelete(u.id)}}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
