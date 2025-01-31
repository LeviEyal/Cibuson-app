import { PageContainer } from "@/components/PageContainer";
import { GoogleOneTap } from "@clerk/nextjs";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();


// app/about/page.tsx
import { Github, Info, Lock, Star } from 'lucide-react';
import FeedbackForm from "./feedback-form";

export const metadata = {
  title: 'אודות סיבוסון - ניהול חכם לשוברי סיבוס ותן ביס',
  description: 'מידע אודות אפליקציית סיבוסון לניהול שוברי סיבוס ותן ביס',
};

export default function AboutPage() {
  const version = publicRuntimeConfig?.version

  return (
    <PageContainer className="pb-10 pt-2">

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">אודות סיבוסון</h1>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Info className="w-6 h-6" />
            <span className="text-xl">גרסה {version}</span>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">על הפרויקט</h2>
          <p className="text-lg text-gray-700 mb-6">
            סיבוסון הוא כלי חכם לניהול שוברי סיבוס ותן ביס. האפליקציה נועדה לפתור את הבעיה של מעקב אחר שוברים דיגיטליים ומאפשרת למשתמשים לנהל את השוברים שלהם בצורה יעילה ונוחה.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            האפליקציה מייבאת באופן אוטומטי שוברים מהמייל, מאפשרת מעקב אחר ניצול השוברים, ומספקת כלים חכמים לניהול רשימות קניות.
          </p>
        </div>

        {/* Links Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href="https://github.com/LeviEyal/Cibuson-app" 
             className="flex items-center justify-center gap-2 bg-gray-900 text-white p-4 rounded-lg hover:bg-gray-800 transition-colors">
            <Github className="w-6 h-6" />
            <span>GitHub</span>
          </a>
          <a href="/privacy"
             className="flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
            <Lock className="w-6 h-6" />
            <span>מדיניות פרטיות</span>
          </a>
          <div className="flex items-center justify-center gap-2 bg-yellow-500 text-white p-4 rounded-lg">
            <Star className="w-6 h-6" />
            <span className="text-xl">גרסה {version}</span>

          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <FeedbackForm />
        </div>
      </div>
      </PageContainer>
  );
}