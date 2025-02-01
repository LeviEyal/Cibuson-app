/* eslint-disable react/no-unescaped-entities */
// app/privacy/page.tsx
import { PageContainer } from '@/components/PageContainer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'מדיניות הפרטיות - סיבוסון',
  description: 'מדיניות הפרטיות של סיבוסון - ניהול חכם לשוברי סיבוס ותן ביס',
}

export default function PrivacyPage() {
  return (
    <PageContainer>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bol mb-8 text-center">מדיניות הפרטיות</h1>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">מבוא</h2>
            <p className="mb-4">
              אנחנו בסיבוסון מחויבים להגן על פרטיותך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך בעת השימוש באפליקציית סיבוסון.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">איסוף מידע</h2>
            <p className="mb-4">
              אנו אוספים את המידע הבא:
            </p>
            <ul className="list-disc mr-6 space-y-2">
              <li>פרטי התחברות לחשבון הג'ימייל שלך (באמצעות OAuth של Google)</li>
              <li>תוכן הודעות דוא"ל הקשורות לשוברי סיבוס ותן ביס</li>
              <li>נתוני השימוש בשוברים שאתה מזין באפליקציה</li>
              <li>רשימות קניות שאתה יוצר באפליקציה</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">שימוש במידע</h2>
            <p className="mb-4">
              אנו משתמשים במידע שנאסף למטרות הבאות:
            </p>
            <ul className="list-disc mr-6 space-y-2">
              <li>סריקה וייבוא אוטומטי של שוברי סיבוס ותן ביס מהמייל שלך</li>
              <li>ניהול ומעקב אחר השימוש בשוברים</li>
              <li>שיפור השירות והממשק</li>
              <li>תמיכה טכנית ופתרון בעיות</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">אבטחת מידע</h2>
            <p className="mb-4">
              אנו נוקטים באמצעי אבטחה מתקדמים כדי להגן על המידע שלך:
            </p>
            <ul className="list-disc mr-6 space-y-2">
              <li>כל התקשורת מוצפנת באמצעות פרוטוקול SSL/TLS</li>
              <li>הגישה למייל שלך מתבצעת באמצעות OAuth של Google בלבד, ללא שמירת סיסמאות</li>
              <li>המידע מאוחסן בשרתים מאובטחים עם גישה מוגבלת</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">שיתוף מידע</h2>
            <p className="mb-4">
              איננו משתפים את המידע האישי שלך עם צדדים שלישיים, למעט במקרים הבאים:
            </p>
            <ul className="list-disc mr-6 space-y-2">
              <li>כאשר נדרש על פי חוק</li>
              <li>לצורך הגנה על זכויותינו המשפטיות</li>
              <li>במקרה של מיזוג או רכישה של החברה (תוך שמירה על מחויבויות הפרטיות הקיימות)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">זכויותיך</h2>
            <p className="mb-4">
              יש לך את הזכויות הבאות בנוגע למידע שלך:
            </p>
            <ul className="list-disc mr-6 space-y-2">
              <li>גישה למידע האישי שלך</li>
              <li>תיקון מידע לא מדויק</li>
              <li>מחיקת המידע שלך מהמערכת</li>
              <li>ביטול ההרשאה לגישה לחשבון הג'ימייל שלך</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">יצירת קשר</h2>
            <p className="mb-4">
              לכל שאלה או בקשה בנוגע למדיניות הפרטיות, ניתן ליצור קשר באמצעות:
            </p>
            <ul className="list-disc mr-6 space-y-2">
              <li>פתיחת issue ב-<a href="https://github.com/LeviEyal/Cibuson-app" className="text-blue-600 hover:text-blue-800">GitHub</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">עדכונים למדיניות הפרטיות</h2>
            <p className="mb-4">
              אנו עשויים לעדכן את מדיניות הפרטיות מעת לעת. במקרה של שינויים מהותיים, נודיע לך באמצעות האפליקציה או בדוא"ל.
            </p>
            <p className="text-sm text-gray-600">
              עודכן לאחרונה: 31 בינואר 2024
            </p>
          </section>
        </div>
      </div>
  </PageContainer>
  )
}