"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlusIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useOrganization } from "@clerk/nextjs";

/**
 * studentName should be a string with a length of at least 1 character and at most 100 characters
 * date should be a string that represents a valid date
 * duration should be a number that is greater than 0
 * price should be a number that is greater than 0
 *
 */
const lessonSchema = z.object({
  studentName: z.string().min(3).max(20),
  date: z.string().transform((val) => new Date(val).getTime()),
  duration: z.number().min(1).max(1000),
  price: z.number().min(1).max(1000),
});

export const NewLessonForm = () => {
  const { organization } = useOrganization();
  const addNewLessonMutation = useMutation(api.lessons.addLesson);

  const studentNameRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const newLesson = {
      studentName: studentNameRef.current?.value || "",
      date: new Date(dateRef.current?.value || "").getTime(),
      duration: Number.parseInt(durationRef.current?.value || ""),
      price: Number.parseInt(priceRef.current?.value || ""),
      orgId: organization?.id,
    };

    // const result = lessonSchema.safeParse(newLesson);
    // if (!result.success) {
    //   alert("אחד או יותר מהשדות אינו תקין");
    //   return;
    // }

    console.log({ newLesson });
    try {
      const res = await addNewLessonMutation(newLesson);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="size-14 space-x-1 rounded-full bg-slate-200"
        >
          {/* <p>הוסף שיעור</p> */}
          <PlusIcon className="size-full" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-10 sm:max-w-[200px]">
        <DrawerHeader>
          <DrawerTitle>הוסף שיעור</DrawerTitle>
        </DrawerHeader>
        <div className="grid gap-4 px-10 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              שם התלמיד
            </Label>
            <Input
              autoFocus
              id="name"
              ref={studentNameRef}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              תאריך
            </Label>
            <Input ref={dateRef} id="date" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              משך השיעור בדקות
            </Label>
            <Input
              ref={durationRef}
              id="duration"
              type="number"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              מחיר
            </Label>
            <Input
              ref={priceRef}
              id="price"
              type="number"
              className="col-span-3"
            />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={handleSubmit}>אישור</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
