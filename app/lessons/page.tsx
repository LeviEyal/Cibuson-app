"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatMonthInHebrew, formatPrice } from "@/lib/utils";
import { LessonCard } from "./LessonCard";
import { NewLessonForm } from "./NewLessonForm";

export default function Page() {
  const lessonsPerMonth = useQuery(api.lessons.allLessons);
  const months = Object.keys(lessonsPerMonth || {}).toReversed();

  const paymentsDataQuery = useQuery(api.lessons.paymentsData);

  return (
    <div className="h-full w-full relative flex flex-col justify-center">
      <main className="flex-1 overflow-y-aut mb-24 h-full">
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

      <footer className="h-24 z-50 fixed bottom-0 left-0 py-3 w-full bg-slate-400 flex flex-col justify-center items-center">
        <div className="absolute -top-8 border-slate-400 border-4 rounded-full">
          <NewLessonForm />
        </div>

        <div className="mt-3 grid grid-cols-3 items-center text-center">
          <div>
            <p> מספר שיעורים כולל:</p>
            {paymentsDataQuery?.totalLessonsCount}
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
