const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.APP_PASSWORD || "willow2026";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tracker.json");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Session tracking via cookie
const COOKIE_NAME = "wg_auth";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

function isAuthenticated(req) {
  const cookies = {};
  (req.headers.cookie || "").split(";").forEach(c => {
    const [k, v] = c.trim().split("=");
    if (k) cookies[k] = v;
  });
  return cookies[COOKIE_NAME] === "true";
}

// Login page
app.get("/login", (req, res) => {
  const error = req.query.error ? '<p style="color:#C0392B;margin-top:12px;font-size:13px;">סיסמה שגויה</p>' : '';
  res.send(`<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Willow Glow — כניסה</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8FAFC; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: white; border-radius: 16px; padding: 40px 36px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 380px; width: 90%; text-align: center; }
    h1 { font-size: 22px; color: #1B2A4A; margin-bottom: 4px; }
    .sub { font-size: 13px; color: #64748B; margin-bottom: 28px; }
    input { width: 100%; padding: 12px 16px; border: 2px solid #E2E8F0; border-radius: 10px; font-size: 15px; outline: none; text-align: center; direction: ltr; }
    input:focus { border-color: #2E75B6; }
    button { width: 100%; padding: 12px; background: linear-gradient(135deg, #1B2A4A, #2E75B6); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 12px; }
    button:hover { opacity: 0.9; }
    .lock { font-size: 36px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="lock">🔒</div>
    <h1>Willow Glow</h1>
    <p class="sub">אסטרטגיית שיווק 30-60-90</p>
    <form method="POST" action="/login">
      <input type="password" name="password" placeholder="הכנס סיסמה" autofocus />
      <button type="submit">כניסה</button>
    </form>
    ${error}
  </div>
</body>
</html>`);
});

app.post("/login", (req, res) => {
  if (req.body.password === PASSWORD) {
    res.setHeader("Set-Cookie", `${COOKIE_NAME}=true; Path=/; Max-Age=${COOKIE_MAX_AGE / 1000}; HttpOnly; SameSite=Lax`);
    res.redirect("/");
  } else {
    res.redirect("/login?error=1");
  }
});

// Auth middleware
app.use((req, res, next) => {
  if (req.path === "/login") return next();
  if (!isAuthenticated(req)) return res.redirect("/login");
  next();
});

// API routes
app.get("/api/data", (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      res.json(JSON.parse(raw));
    } else {
      res.json(null);
    }
  } catch (e) {
    res.json(null);
  }
});

app.post("/api/data", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), "utf-8");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Willow Glow Tracker running on port ${PORT}`);
});
