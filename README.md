# Willow Glow — Strategy Tracker 🔒

כלי מעקב אסטרטגיה 30-60-90 יום עם הגנת סיסמה.

## הוראות העלאה ל-Railway (5 דקות)

### שלב 1 — GitHub
1. צור repo חדש ב-GitHub (פרטי!)
2. העלה את כל הקבצים (package.json, server.js, public/)

### שלב 2 — Railway
1. היכנס ל-[railway.app](https://railway.app) (חינם עד $5/חודש)
2. לחץ **New Project** → **Deploy from GitHub Repo**
3. בחר את ה-repo שיצרת
4. Railway יזהה אוטומטית שזה Node.js ויתחיל build

### שלב 3 — סיסמה
1. ב-Railway, לך ל-**Variables**
2. הוסף: `APP_PASSWORD` = הסיסמה שתרצה (ברירת מחדל: `willow2026`)

### שלב 4 — אחסון קבוע
1. ב-Railway, לך ל-**Settings** → **Volumes**
2. הוסף Volume חדש: Mount Path = `/data`
3. בחזרה ב-**Variables**, הוסף: `DATA_DIR` = `/data`

### שלב 5 — דומיין
1. ב-Railway, לך ל-**Settings** → **Networking** → **Generate Domain**
2. תקבל לינק כמו: `willow-tracker-production.up.railway.app`
3. שתף את הלינק + הסיסמה עם הבעלים

## שימוש
- כניסה עם סיסמה (נשמרת 30 יום)
- כל שינוי נשמר אוטומטית
- עובד מכל מכשיר (מחשב + טלפון)
