import { asc, eq } from "drizzle-orm";
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
			makePublic: z.boolean().default(true)
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(files).values({
				name: input.name,
				public: input.makePublic,
				createdById: ctx.session.user.id,
			});
		}),

	update: protectedProcedure
		.input(z.array(z.object({
			id: z.number(),
			order: z.number(),
		})))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				await Promise.all(
					input.map(async (swap) =>
						tx.update(files)
							.set({
								order: swap.order
							})
							.where(eq(files.id, swap.id))
					)
				)
			});
			return {
				success: true
			};
		}),

	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.files.findMany({
			where: eq(files.public, true)
		});
	}),

	getByUserId: publicProcedure
		.input(z.string().optional())
		.query(({ ctx, input }) => {
			if (!input) {
				throw new Error("userId is required");
			}
			return ctx.db.query.files.findMany({
				where: eq(files.createdById, input),
				orderBy: [asc(files.order)]
			});
		}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
