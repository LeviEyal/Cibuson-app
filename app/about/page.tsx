import { PageContainer } from "@/components/PageContainer";
import { GoogleOneTap } from "@clerk/nextjs";

export default function AboutPage() {
  return (
    <PageContainer className="pb-10">
      <h1 className="text-2xl text-center mb-4">אודות</h1>
      <p className="text-lg text-center">
        פרויקט זה נוצר על מנת לסייע לכם לחסוך כסף בקניות ברשתות המזון השונות.
      </p>
      <p className="text-lg text-center">
        המחשבון יעזור לכם למצוא את השוברים הכי טובים לקנייתכם.
      </p>
      <GoogleOneTap />
        <p className="text-lg text-center">
          נשמח לשמוע מכם תגובות והצעות לשיפור במייל{" "}
          <a href="mailto: happyeyal@gmail.com" className="underline"></a>
        </p>
    </PageContainer>
  );
}
