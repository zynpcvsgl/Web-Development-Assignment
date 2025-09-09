import { useState } from 'react'
import type { Post } from '../types'

type Props = {
  posts: Post[]
  onUpdate: (id: number, p: Partial<Post>) => void
  onDelete: (id: number) => void
}

export default function PostList({ posts, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState('')

  return (
    <table className="table" id="posts">
      <thead><tr><th>ID</th><th>UserId</th><th>Title</th><th>Actions</th></tr></thead>
      <tbody>
        {posts.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.userId}</td>
            <td>
              {editingId===p.id
                ? <input defaultValue={p.title} onChange={e=>setDraftTitle(e.target.value)} />
                : p.title}
            </td>
            <td>
              {editingId===p.id ? (
                <>
                  <button onClick={()=>{onUpdate(p.id, { title: draftTitle || p.title }); setEditingId(null)}}>Save</button>
                  <button onClick={()=>setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={()=>{setEditingId(p.id); setDraftTitle(p.title)}}>Edit</button>
                  <button onClick={()=>onDelete(p.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
