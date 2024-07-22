"use client";

import { useQuery } from "convex/react";
import { NewLessonForm } from "./NewLessonForm";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { LessonCard } from "./LessonCard";

export default function Page() {
  const lessonsPerMonth = useQuery(api.lessons.allLessons);
  const months = Object.keys(lessonsPerMonth || {}).toReversed();

  const paymentsDataQuery = useQuery(api.lessons.paymentsData);

  return (
    <div className="h-full w-full bg-slate-200 relative flex flex-col justify-center">
      <header className="flex justify-center items-center bg-slate-400 sticky top-0">
        <Image src="/cat.png" width={50} height={50} alt="logo" />
        <h1 className="text-center text-2xl p-5">אפליקציה למאמיש</h1>
        <NewLessonForm />
      </header>

      {lessonsPerMonth === undefined &&
        Array.from({ length: 10 }).map((_, i) => (
          <LessonCard.Skeleton key={i} />
        ))}

      {lessonsPerMonth && months?.map((month) => {
        const lessons = lessonsPerMonth[month];

        return (
          <div key={month}>
            <h1 className="text-center my-5">{month}</h1>
            <div className="flex flex-col gap-4">
              {lessons?.map((lesson) => (
                <LessonCard key={lesson._id} lesson={lesson} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="fixed bottom-0 left-0 py-3 w-full bg-slate-400 flex flex-col justify-center items-center">
        <div className="grid grid-cols-3 items-center text-center">
          <div>
            מספר שיעורים ששולמו:{" "}
            {formatPrice(paymentsDataQuery?.totalThisMonth as number)}
          </div>
          <div>
            מחכה לתשלום: {formatPrice(paymentsDataQuery?.pending as number)}
          </div>
          <div>
            סכום ששולם: {formatPrice(paymentsDataQuery?.total as number)}
          </div>
        </div>
      </div>
    </div>
  );
}
