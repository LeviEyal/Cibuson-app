import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const allLessons = query({
  args: {},
  handler: async (ctx) => {
    const ans: Record<string, Doc<"lesson">[]> = {};
    const lessons = await ctx.db.query("lesson").order("desc").take(100);
    lessons.forEach((lesson) => {
      // In the form of YYYY-MM:
      const month = new Date(lesson.date).toISOString().slice(0, 7);
      if (!ans[month]) ans[month] = [];
      ans[month].push(lesson);
    });

    return ans;
  },
});

export const addLesson = mutation({
  args: {
    studentName: v.string(),
    date: v.number(),
    duration: v.number(),
    price: v.number(),
  },
  handler: async (ctx, { studentName, date, duration, price }) => {
    await ctx.db.insert("lesson", {
      studentName,
      date,
      duration,
      price,
      paid: false,
    });
  },
});

export const payLesson = mutation({
  args: { _id: v.any() },
  handler: async (ctx, { _id }) => {
    await ctx.db.patch(_id, { paid: true });
  },
});

export const paymentsData = query({
  args: {},
  handler: async (ctx) => {
    const lessons = await ctx.db.query("lesson").take(1000);
    const pending = lessons.filter((lesson) => !lesson.paid).reduce((acc, lesson) => acc + lesson.price, 0);
    const totalThisMonth = lessons.filter(
      (lesson) => new Date(lesson.date).getMonth() === new Date().getMonth(),
    ).reduce((acc, lesson) => acc + lesson.price, 0);
    const total = lessons.reduce((acc, lesson) => acc + lesson.price, 0);
    
    return { pending, totalThisMonth, total };
  },
});
