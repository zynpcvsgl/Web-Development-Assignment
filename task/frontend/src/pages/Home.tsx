import { useState, useEffect, useMemo } from "react";
import {
  Container, Typography, Paper, Box,
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, MenuItem, Select, InputLabel, FormControl,
  IconButton, Tooltip, Snackbar, Alert, TablePagination
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
}

const API = "http://localhost:3000";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  // Filtre: "" = hepsi, "1" = user id 1
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Form alanları
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");

  // Bildirim
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: "success" | "error" }>({
    open: false, msg: "", severity: "success"
  });
  const openToast = (msg: string, severity: "success" | "error" = "success") =>
    setToast({ open: true, msg, severity });

  // --- Arama ve Sayfalama state'leri ---
  const [q, setQ] = useState("");               // kullanıcı arama metni
  const [pageUsers, setPageUsers] = useState(0);
  const [rppUsers, setRppUsers] = useState(10);
  const [pagePosts, setPagePosts] = useState(0);
  const [rppPosts, setRppPosts] = useState(10);

  useEffect(() => {
    fetch(`${API}/users`).then(r => r.json()).then(setUsers).catch(() => openToast("Kullanıcılar alınamadı", "error"));
    fetch(`${API}/posts`).then(r => r.json()).then(setPosts).catch(() => openToast("Gönderiler alınamadı", "error"));
  }, []);

  // --- Filtrelenmiş kullanıcılar (Arama) ---
  const filteredUsers = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u =>
      [u.name, u.username, u.email].some(v => v.toLowerCase().includes(term))
    );
  }, [users, q]);

  // --- Kullanıcılar için sayfalama (filtre sonrası) ---
  const pagedUsers = useMemo(() => {
    const start = pageUsers * rppUsers;
    return filteredUsers.slice(start, start + rppUsers);
  }, [filteredUsers, pageUsers, rppUsers]);

  // --- Gönderiler: kullanıcı filtresi ---
  const filteredPosts = useMemo(() => {
    if (selectedUserId === "") return posts;
    const id = parseInt(selectedUserId, 10);
    return posts.filter(p => p.userId === id);
  }, [posts, selectedUserId]);

  // --- Gönderiler için sayfalama ---
  const pagedPosts = useMemo(() => {
    const start = pagePosts * rppPosts;
    return filteredPosts.slice(start, start + rppPosts);
  }, [filteredPosts, pagePosts, rppPosts]);

  // Arama metni değiştiğinde kullanıcı sayfasını başa al
  useEffect(() => { setPageUsers(0); }, [q]);
  // Kullanıcı filtresi değiştiğinde post sayfasını başa al
  useEffect(() => { setPagePosts(0); }, [selectedUserId]);

  const emailOk = /\S+@\S+\.\S+/.test(newEmail);

  // --- CRUD: Users ---
  const addUser = async () => {
    if (!newName || !newUsername || !emailOk) return;
    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, username: newUsername, email: newEmail })
      });
      const created = await res.json();
      setUsers(prev => [...prev, created]);
      setNewName(""); setNewUsername(""); setNewEmail("");
      openToast("Kullanıcı eklendi");
    } catch {
      openToast("Kullanıcı eklenemedi", "error");
    }
  };

  const editUser = async (u: User) => {
    const name = prompt("Ad", u.name); if (name === null) return;
    const username = prompt("Kullanıcı Adı", u.username); if (username === null) return;
    const email = prompt("E-posta", u.email); if (email === null) return;

    try {
      const res = await fetch(`${API}/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email })
      });
      const updated: User = await res.json();
      setUsers(prev => prev.map(x => (x.id === u.id ? updated : x)));
      openToast("Kullanıcı güncellendi");
    } catch {
      openToast("Kullanıcı güncellenemedi", "error");
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Kullanıcıyı silmek istediğine emin misin?")) return;
    try {
      await fetch(`${API}/users/${id}`, { method: "DELETE" });
      setUsers(prev => prev.filter(x => x.id !== id));
      setPosts(prev => prev.filter(p => p.userId !== id)); // o kullanıcıya ait postları listeden temizle
      openToast("Kullanıcı silindi");
    } catch {
      openToast("Kullanıcı silinemedi", "error");
    }
  };

  // --- CRUD: Posts ---
  const addPost = async () => {
    if (selectedUserId === "" || !newPostTitle) return;
    try {
      const userId = parseInt(selectedUserId, 10);
      const res = await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title: newPostTitle })
      });
      const created: Post = await res.json();
      setPosts(prev => [...prev, created]);
      setNewPostTitle("");
      openToast("Gönderi eklendi");
    } catch {
      openToast("Gönderi eklenemedi", "error");
    }
  };

  const editPost = async (p: Post) => {
    const title = prompt("Gönderi Başlığı", p.title);
    if (title === null) return;
    try {
      const res = await fetch(`${API}/posts/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      const updated: Post = await res.json();
      setPosts(prev => prev.map(x => (x.id === p.id ? updated : x)));
      openToast("Gönderi güncellendi");
    } catch {
      openToast("Gönderi güncellenemedi", "error");
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Gönderiyi silmek istediğine emin misin?")) return;
    try {
      await fetch(`${API}/posts/${id}`, { method: "DELETE" });
      setPosts(prev => prev.filter(x => x.id !== id));
      openToast("Gönderi silindi");
    } catch {
      openToast("Gönderi silinemedi", "error");
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Kullanıcılar & Gönderiler
      </Typography>

      {/* KULLANICILAR */}
      <Paper elevation={4} sx={{ p: 3, mb: 5, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="500" gutterBottom>
          Kullanıcılar
        </Typography>

        {/* Arama + Ekle formu */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
          <TextField
            label="Ara (Ad / Kullanıcı Adı / E-posta)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            size="small"
            sx={{ minWidth: 260, flexGrow: 1 }}
          />
          <TextField label="Ad" value={newName} onChange={e => setNewName(e.target.value)} size="small" />
          <TextField label="Kullanıcı Adı" value={newUsername} onChange={e => setNewUsername(e.target.value)} size="small" />
          <TextField label="E-posta" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} size="small" />
          <Button variant="contained" onClick={addUser} sx={{ px: 3 }} disabled={!newName || !newUsername || !emailOk}>
            Kullanıcı Ekle
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ad</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Kullanıcı Adı</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>E-posta</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedUsers.map(u => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Düzenle">
                      <IconButton color="primary" size="small" onClick={() => editUser(u)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton color="secondary" size="small" onClick={() => deleteUser(u.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {pagedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, opacity: 0.7 }}>
                    Kayıt bulunamadı
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={pageUsers}
          onPageChange={(_, p) => setPageUsers(p)}
          rowsPerPage={rppUsers}
          onRowsPerPageChange={(e) => { setRppUsers(parseInt(e.target.value, 10)); setPageUsers(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* GÖNDERİLER */}
      <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="500" gutterBottom>
          Gönderiler
        </Typography>

        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }} size="small" variant="outlined">
            <InputLabel id="user-filter-label" shrink>
              Kullanıcı
            </InputLabel>
            <Select
              labelId="user-filter-label"
              id="user-filter"
              label="Kullanıcı"
              value={selectedUserId}              // string
              displayEmpty
              renderValue={(value) => {
                if (value === "") return <span style={{ opacity: 0.6 }}>Hepsi</span>;
                const u = users.find(x => x.id === parseInt(value as string, 10));
                return u ? u.name : value;
              }}
              onChange={(e) => setSelectedUserId(e.target.value as string)}
            >
              <MenuItem value="">
                <em>Hepsi</em>
              </MenuItem>
              {users.map(u => (
                <MenuItem key={u.id} value={String(u.id)}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <TextField
            label="Gönderi Başlığı"
            value={newPostTitle}
            onChange={e => setNewPostTitle(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
          />
          <Button
            variant="contained"
            onClick={addPost}
            sx={{ px: 3 }}
            disabled={selectedUserId === "" || !newPostTitle}
          >
            Gönderi Ekle
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Kullanıcı ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Başlık</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedPosts.map(p => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.userId}</TableCell>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>
                    <Tooltip title="Düzenle">
                      <IconButton color="primary" size="small" onClick={() => editPost(p)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton color="secondary" size="small" onClick={() => deletePost(p.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {pagedPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, opacity: 0.7 }}>
                    Gönderi bulunamadı
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredPosts.length}
          page={pagePosts}
          onPageChange={(_, p) => setPagePosts(p)}
          rowsPerPage={rppPosts}
          onRowsPerPageChange={(e) => { setRppPosts(parseInt(e.target.value, 10)); setPagePosts(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={() => setToast(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(s => ({ ...s, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
