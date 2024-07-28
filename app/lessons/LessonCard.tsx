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

import { TrashIcon, CalendarIcon, CheckIcon } from "@radix-ui/react-icons";
import { formatPrice } from "@/lib/utils";
import clsx from "clsx";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";

export const LessonCard = ({ lesson }: any) => {
  const { memberships } = useOrganization({ memberships: { infinite: true } });
  const payLessonMutation = useMutation(api.lessons.payLesson);
  const deleteLessonMutation = useMutation(api.lessons.deleteLesson);

  const author = memberships?.data?.find(
    (membership) => membership.publicUserData.userId === lesson.user,
  );

  const date = new Date(lesson.date);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const formattedPrice = formatPrice(lesson.price);

  const isPast = date < new Date();
  const duration = lesson.duration;

  // remove all the '-' and ':' from the date string
  const dateFromISOString = new Date(date).toISOString().replace(/[-:]/g, "");
  // same as dateFrom but with the addition of the duration in minutes
  const dateTo = new Date(date).setMinutes(date.getMinutes() + duration);
  const dateToISOString = new Date(dateTo).toISOString().replace(/[-:]/g, "");

  const event = {
    title: "שיעור עם " + lesson.studentName,
    dates: `${dateFromISOString}/${dateToISOString}`,
    location: "כתובת השיעור",
  };
  const eventLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${event.title}&dates=${event.dates}&details=For+details,+link+here:+http://www.example.com&location=${event.location}&sf=true&output=xml`;

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
                      <AlertDialogAction
                        onClick={() =>
                          deleteLessonMutation({ _id: lesson._id })
                        }
                      >
                        מחק שיעור
                      </AlertDialogAction>
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
                      <AlertDialogTitle>
                        האם תשלום בוצע עבור שיעור זה?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        האם אתה בטוח שברצונך לבטל את השיעור עם{" "}
                        {lesson.studentName}? פעולה זו אינה ניתנת לביטול.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ביטול פעולה</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => payLessonMutation({ _id: lesson._id })}
                      >
                        סמן ביצוע תשלום עבור שיעור זה
                      </AlertDialogAction>
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
        <div className="flex items-center justify-around w-full h-full">
          {author?.publicUserData.imageUrl && (
            <Image
              className="rounded-full"
              width={20}
              height={20}
              src={author?.publicUserData.imageUrl}
              alt="a"
            />
          )}
          <Link href={eventLink} target="_blank">
            <CalendarIcon />
          </Link>
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
