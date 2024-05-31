import { eq } from "drizzle-orm";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { files } from "~/server/db/schema";

export const fileRouter = createTRPCRouter({
	create: protectedProcedure
		.input(z.object({
			name: z.string().min(1),
			public: z.boolean().default(true)
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(files).values({
				name: input.name,
				public: input.public,
				createdById: ctx.session.user.id,
			});
		}),

	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.files.findMany({
			where: eq(files.public, true)
		});
	}),

	getByUserId: publicProcedure
		.input(z.string())
		.query(({ ctx, input }) => {
			return ctx.db.query.files.findMany({
				where: eq(files.createdById, input)
			});
		}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
