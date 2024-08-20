"use client";

import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { formatMonthInHebrew, formatPrice } from "@/lib/utils";

import { LessonCard } from "./LessonCard";
import { NewLessonForm } from "./NewLessonForm";

export default function Page() {
  const { organization } = useOrganization();
  const lessonsPerMonth = useQuery(api.lessons.allLessons, {
    orgId: organization?.id,
  });
  const months = Object.keys(lessonsPerMonth || {}).toReversed();

  const paymentsDataQuery = useQuery(api.lessons.paymentsData);

  return (
    <div className="relative mb-24 flex h-full w-full flex-col justify-center">
      <main className="h-full flex-1">
        {lessonsPerMonth === undefined &&
          Array.from({ length: 10 }).map((a, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
                <header className="my-5 flex w-full items-center justify-center gap-2 text-center">
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
        <div className="h-10" />
      </main>

      <footer className="fixed bottom-0 left-0 z-50 flex h-24 w-full flex-col items-center justify-center bg-slate-400 py-3">
        <div className="absolute -top-8 rounded-full border-4 border-slate-400">
          <NewLessonForm />
        </div>

        <div className="mt-3 grid grid-cols-3 items-center gap-6 text-center">
          <div>
            <p>סה&quot;כ שיעורים</p>
            <p className="text-xl">
              {paymentsDataQuery?.totalLessonsCount
                ? paymentsDataQuery?.totalLessonsCount
                : "..."}
            </p>
          </div>
          <div>
            <p>מחכה לתשלום</p>
            <p className="text-xl">
              {paymentsDataQuery?.pending
                ? formatPrice(paymentsDataQuery?.pending as number)
                : "..."}
            </p>
          </div>
          <div>
            <p>סכום ששולם</p>
            <p className="text-xl">
              {paymentsDataQuery?.total
                ? formatPrice(paymentsDataQuery?.total as number)
                : "..."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
