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
import SwipeToRevealActions from "react-swipe-to-reveal-actions";

import { TrashIcon, Pencil1Icon, CheckIcon } from "@radix-ui/react-icons";
import { formatPrice } from "@/lib/utils";
import clsx from "clsx";
import { api } from "@/convex/_generated/api";

export const LessonCard = ({ lesson }: any) => {
  const payLessonMutation = useMutation(api.lessons.payLesson);
  const deleteLessonMutation = useMutation(api.lessons.deleteLesson);

  const date = new Date(lesson.date);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const formattedPrice = formatPrice(lesson.price);

  const isPast = date < new Date();

  return (
    <div
      className={clsx("h-20 rounded-xl shadow mx-5", {
        "bg-white opacity-50": isPast,
        "bg-white": !isPast,
        "border-b-2 border-green-500": lesson.paid,
        "border-b-2 border-red-500": !lesson.paid,
      })}
      dir="ltr"
    >
      <SwipeToRevealActions
        containerStyle={{
          width: "100%",
          height: "80px",
          padding: "10px",
        }}
        actionButtons={[
        //   {
        //     content: (
        //       <div className="bg-yellow-300 rounded-3xl text-black size-12 flex justify-center items-center">
        //         <Pencil1Icon width={25} height={25} />
        //       </div>
        //     ),
        //     onClick: () => alert("Pressed the EDIT button"),
        //   },
          {
            content: (
              <div className="bg-red-300 rounded-3xl text-black size-12 flex justify-center items-center">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <button className="h-full flex justify-center items-center">
                      <TrashIcon width={25} height={25} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>האם לבטל שיעור זה?</AlertDialogTitle>
                      <AlertDialogDescription>
                        האם אתה בטוח שברצונך לבטל את השיעור עם{" "}
                        {lesson.studentName}? פעולה זו אינה ניתנת לביטול.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ביטול מחיקה</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteLessonMutation({_id: lesson._id})}>מחק שיעור</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ),
            onClick: () => {},
          },
          {
            content: (
              <div className="bg-green-300 rounded-3xl text-black size-12 flex justify-center items-center">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <button className="h-full flex justify-center items-center">
                      <CheckIcon width={25} height={25} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>האם תשלום בוצע עבור שיעור זה?</AlertDialogTitle>
                      <AlertDialogDescription>
                        האם אתה בטוח שברצונך לבטל את השיעור עם{" "}
                        {lesson.studentName}? פעולה זו אינה ניתנת לביטול.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ביטול פעולה</AlertDialogCancel>
                      <AlertDialogAction onClick={() => payLessonMutation({_id: lesson._id})}>סמן ביצוע תשלום עבור שיעור זה</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ),
            onClick: () => {},
          },
        ]}
        actionButtonMinWidth={70}
      >
        <div className="flex justify-around w-full h-full">
          <p>{formattedDate}</p>
          <p>{formattedPrice}</p>
          <p>{lesson.studentName}</p>
        </div>
      </SwipeToRevealActions>
    </div>
  );
};

LessonCard.Skeleton = function LessonCardSkeleton() {
  return (
    <div className="flex justify-around text-right gap-3 border rounded-xl shadow mx-5 p-5 animate-pulse">
      <Skeleton className="w-1/4 h-5 rounded" />
      <Skeleton className="w-1/4 h-5 rounded" />
      <Skeleton className="w-1/4 h-5 rounded" />
      <Skeleton className="w-1/4 h-5 rounded" />
    </div>
  );
};
