"use client";

import { useMutation, useQuery } from "convex/react";
import { NewLessonForm } from "./NewLessonForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { TrashIcon } from "@radix-ui/react-icons";

import { api } from "@/convex/_generated/api";
import clsx from "clsx";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const LessonCard = ({ lesson, isPast = false }: any) => {
  const payLessonMutation = useMutation(api.lessons.payLesson);

  const date = new Date(lesson.date);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const formattedPrice = formatPrice(lesson.price);

  return (
    <div
      key={lesson.id}
      className={clsx(
        "flex justify-around flex-row-reverse text-right gap-3 border rounded shadow bg-white mx-5 p-5",
        {
          "bg-slate-300": lesson.paid,
          "bg-slate-500": !lesson.paid,
        },
      )}
    >
      <p>{lesson.studentName}</p>
      <p>{formattedDate}</p>
      <p>{formattedPrice}</p>
      <input
        type="checkbox"
        checked={lesson.paid}
        onChange={() => payLessonMutation({ _id: lesson._id })}
      />
      <AlertDialog>
        <AlertDialogTrigger>
          <button>
            <TrashIcon />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם לבטל שיעור זה?</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך לבטל את השיעור עם {lesson.studentName}? פעולה
              זו אינה ניתנת לביטול.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול מחיקה</AlertDialogCancel>
            <AlertDialogAction>מחק שיעור</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default function Page() {
  const lessons = useQuery(api.lessons.allLessons);
  const pastLessons = lessons?.past;
  const futureLessons = lessons?.future;

  const paymentsDataQuery = useQuery(api.lessons.paymentsData);

  return (
    <div className="h-full w-full bg-slate-200 relative flex flex-col justify-center">
      <header className="flex justify-center items-center">
        <Image src="/cat.png" width={50} height={50} alt="logo"/>
        <h1 className="text-center text-2xl p-5">אפליקציה למאמיש</h1>
      </header>
      <NewLessonForm />

      <h1 className="text-center mt-5">שיעורים עתידיים</h1>
      <div className="flex flex-col gap-4">
        {futureLessons?.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>

      <h1 className="text-center mt-5">שיעורים שעברו</h1>
      <div className="flex flex-col gap-4">
        {pastLessons?.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} isPast={true} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 py-3 w-full bg-slate-400 flex flex-col justify-center items-center">
        <h1>נתונים</h1>
        <div className="flex justify-between gap-2">
          <p>{formatPrice(paymentsDataQuery?.pending as number)}</p>
          <p>{formatPrice(paymentsDataQuery?.totalThisMonth as number)}</p>
          <p>{formatPrice(paymentsDataQuery?.total as number)}</p>
        </div>
      </div>
    </div>
  );
}
