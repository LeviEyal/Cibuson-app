"use client";

import { useMutation } from "convex/react";
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
import { Skeleton } from "@/components/ui/skeleton";

import { TrashIcon } from "@radix-ui/react-icons";
import { formatPrice } from "@/lib/utils";
import clsx from "clsx";
import { api } from "@/convex/_generated/api";

export const LessonCard = ({ lesson }: any) => {
  const payLessonMutation = useMutation(api.lessons.payLesson);

  const date = new Date(lesson.date);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const formattedPrice = formatPrice(lesson.price);

  const isPast = date < new Date();

  return (
    <div
      key={lesson.id}
      className={clsx(
        "flex justify-around flex-row-reverse text-right gap-3 rounded-xl shadow mx-5 p-5",
        {
          "bg-white opacity-50": isPast,
          "bg-white": !isPast,
          "border-b-2 border-green-500": lesson.paid,
          "border-b-2 border-red-500": !lesson.paid,
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

LessonCard.Skeleton = function LessonCardSkeleton() {
  return (
    <div className="flex justify-around flex-row-reverse text-right gap-3 border rounded-xl shadow mx-5 p-5 animate-pulse">
      <Skeleton className="w-1/4 h-5 rounded" />
      <Skeleton className="w-1/4 h-5 rounded" />
      <Skeleton className="w-1/4 h-5 rounded" />
      <Skeleton className="w-1/4 h-5 rounded" />
    </div>
  );
};
