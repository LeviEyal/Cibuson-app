"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DialogClose } from "@radix-ui/react-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { z } from "zod";

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
  const addNewLessonMutation = useMutation(api.lessons.addLesson);

  const studentNameRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const newLesson = {
      studentName: studentNameRef.current?.value || "",
      date: new Date(dateRef.current?.value || "").getTime(),
      duration: parseInt(durationRef.current?.value || ""),
      price: parseInt(priceRef.current?.value || ""),
    };

    const result = lessonSchema.safeParse(newLesson);
    if (!result.success) {
      console.error(result.error);
      return;
    }

    console.log({ newLesson });
    try {
      const res = await addNewLessonMutation(newLesson);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-1 rounded-full size-14">
          {/* <p>הוסף שיעור</p> */}
          <PlusIcon className="size-full" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>הוסף שיעור</DialogTitle>
          <DialogDescription>הוסף שיעור חדש למערכת</DialogDescription>
          <DialogDescription>את כל הפרטים ניתן לשנות בהמשך</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input id="name" ref={studentNameRef} className="col-span-3" />
            <Label htmlFor="name" className="text-right">
              שם התלמיד
            </Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input ref={dateRef} id="date" type="date" className="col-span-3" />
            <Label htmlFor="date" className="text-right">
              תאריך
            </Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              ref={durationRef}
              id="duration"
              type="number"
              className="col-span-3"
            />
            <Label htmlFor="duration" className="text-right">
              משך השיעור בדקות
            </Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              ref={priceRef}
              id="price"
              type="number"
              className="col-span-3"
            />
            <Label htmlFor="price" className="text-right">
              מחיר
            </Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ביטול</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSubmit}>אישור</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
