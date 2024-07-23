"use client";

import { useQuery } from "convex/react";
import { NewLessonForm } from "./NewLessonForm";
import { api } from "@/convex/_generated/api";
import { formatMonthInHebrew, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { LessonCard } from "./LessonCard";
import { Menu } from "./Menu";

export default function Page() {
  const lessonsPerMonth = useQuery(api.lessons.allLessons);
  const months = Object.keys(lessonsPerMonth || {}).toReversed();

  const paymentsDataQuery = useQuery(api.lessons.paymentsData);
  const totalLessonsQuery = useQuery(api.lessons.totalLessons);

  return (
    <div className="h-full w-full bg-slate-200 relative flex flex-col justify-center">
      <header className="z-50 flex justify-center items-center bg-slate-400 sticky top-0">
        <Menu />
        <h1 className="text-center text-2xl p-5">אפליקציה למאמיש</h1>
        <Image src="/cat.png" width={50} height={50} alt="logo" />
        <NewLessonForm />
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {lessonsPerMonth === undefined &&
          Array.from({ length: 10 }).map((_, i) => (
            <LessonCard.Skeleton key={i} />
          ))}

        {lessonsPerMonth &&
          months?.map((month) => {
            const lessons = lessonsPerMonth[month];
            const totalThisMonth = formatPrice(
              lessons?.reduce((acc, lesson) => acc + lesson.price, 0),
            );

            return (
              <div key={month}>
                <header className="flex w-full justify-center items-center gap-2 text-center my-5">
                  <h1 className="">{formatMonthInHebrew(month)}</h1>
                  <p className="text-right"> (סהכ חודשי: {totalThisMonth}) </p>
                </header>
                <div className="flex flex-col gap-4">
                  {lessons?.map((lesson) => (
                    <LessonCard key={lesson._id} lesson={lesson} />
                  ))}
                </div>
              </div>
            );
          })}
      </main>

      <footer className="h-20 z-50 fixed bottom-0 left-0 py-3 w-full bg-slate-400 flex flex-col justify-center items-center">
        <div className="grid grid-cols-3 items-center text-center">
          <div>
            <p> מספר שיעורים כולל:</p>
            {totalLessonsQuery}
          </div>
          <div>
            <p>מחכה לתשלום:</p>
            {formatPrice(paymentsDataQuery?.pending as number)}
          </div>
          <div>
            <p>סכום ששולם:</p>
            {formatPrice(paymentsDataQuery?.total as number)}
          </div>
        </div>
      </footer>
    </div>
  );
}
