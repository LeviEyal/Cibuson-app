<div dir="rtl">

# 🎫 סיבוסון - ניהול חכם לשוברי סיבוס ותן ביס

אפליקציה שעוזרת לכם לנהל את שוברי סיבוס ותן ביס בצורה חכמה ונוחה. האפליקציה סורקת את המיילים שלכם באופן אוטומטי, מייבאת את השוברים, ומאפשרת לכם לעקוב אחריהם בקלות.

[לינק לאפליקציה](https://cibuson.vercel.app)

## 📸 תצלומי מסך

<div align="center">

### דשבורד ראשי
<img src="https://github.com/user-attachments/assets/e893bc6b-21ce-4f63-a830-ad3f415fe9ab" alt="Dashboard" width="500"/>


### רשימת קניות חכמה

<img src="https://github.com/user-attachments/assets/c54eb661-2f5c-462a-b633-a80246e33e84" alt="Dashboard" width="500"/>

### קבלת שוברים מתאימים לקנייה שלך

<img src="https://github.com/user-attachments/assets/194d121b-2299-4806-87b0-2f70a16fe841" alt="Dashboard" width="500"/>

<img src="https://github.com/user-attachments/assets/dc0b00d3-418f-46d8-a774-317294a86469" alt="Dashboard" width="500"/>

</div>

</div>

## ✨ יכולות עיקריות

- **🔄 סריקה אוטומטית**: האפליקציה סורקת את תיבת הדואר שלכם ומייבאת את כל השוברים באופן אוטומטי
- **📊 ניהול שוברים**: 
  - מעקב אחר שוברים פעילים
  - סימון שוברים שנוצלו
  - סימון שוברים תקולים
- **📝 רשימת קניות חכמה**:
  - כתיבה חופשית של פריטים
  - סיווג אוטומטי לקטגוריות
  - ארגון חכם של רשימת הקניות

## 🚀 התקנה למפתחים

### דרישות מקדימות

- חשבון [Vercel](https://vercel.com)
- חשבון [Clerk](https://clerk.com)
- חשבון [Convex](https://convex.dev)

### שלבי התקנה

1. **שכפול הפרויקט**
```bash
git clone https://github.com/LeviEyal/Cibuson-app.git
cd Cibuson-app
npm install
```

2. **הגדרת משתני סביבה**

צור קובץ `.env` והוסף את המשתנים הבאים:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

3. **הפעלת סביבת פיתוח**
```bash
npm run dev
```

## 🏗️ ארכיטקטורה

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Authentication**: Clerk

### Backend
- **Database**: Convex
- **APIs**: 
  - Gmail API לסריקת מיילים
  - Text Analysis לקטגוריזציה של פריטי קניות

## 📦 דיפלוי

1. התחבר ל-Vercel והגדר את משתני הסביבה
2. חבר את הריפוזיטורי ל-Vercel
3. בצע דיפלוי

## 🤝 תרומה לפרויקט

נשמח לקבל תרומות! אנא צרו issue או הגישו pull request.

## 📄 רישיון

MIT License - ראה [LICENSE](LICENSE) לפרטים נוספים.

</div>
