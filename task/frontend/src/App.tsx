import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#521270ff" },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "#fff" : "#1e1e1e"
          }
        },
        shape: { borderRadius: 8 }
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="sticky" color="primary" sx={{ mb: 3 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            Demo: Kullanıcılar & Gönderiler
          </Typography>
          <IconButton color="inherit" onClick={() => setMode(mode === "light" ? "dark" : "light")}>
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <main>
        <Outlet />
      </main>
    </ThemeProvider>
  );
}
