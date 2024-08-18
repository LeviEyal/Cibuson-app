import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

export const allLessons = query({
  args: { orgId: v.optional(v.string()) },
  handler: async (ctx, { orgId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return {};

    const ans: Record<string, Doc<"lesson">[]> = {};
    const lessons = await ctx.db
      .query("lesson")
      .filter((q) =>
        orgId
          ? q.eq(q.field("orgId"), orgId)
          : q.eq(q.field("user"), identity.subject),
      )
      .order("desc")
      .collect();

    lessons.sort((a, b) => b.date - a.date);
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
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, { studentName, date, duration, price, orgId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    await ctx.db.insert("lesson", {
      studentName,
      date,
      duration,
      price,
      paid: false,
      user: identity.subject,
      orgId,
    });
  },
});

export const payLesson = mutation({
  args: { _id: v.any() },
  handler: async (ctx, { _id }) => {
    const current = (await ctx.db.get(_id)) as Doc<"lesson">;
    if (!current) return;
    await ctx.db.patch(_id, { paid: !current.paid });
  },
});

export const paymentsData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return {};

    const lessons = await ctx.db
      .query("lesson")
      .filter((q) => q.eq(q.field("user"), identity.subject))
      .collect();

    const pending = lessons
      .filter((lesson) => !lesson.paid)
      .reduce((acc, lesson) => acc + lesson.price, 0);

    const totalLessonsCount = lessons.length;

    const total = lessons.reduce((acc, lesson) => acc + lesson.price, 0);

    return { pending, totalLessonsCount, total };
  },
});

export const deleteLesson = mutation({
  args: { _id: v.any() },
  handler: async (ctx, { _id }) => {
    await ctx.db.delete(_id);
  },
});
