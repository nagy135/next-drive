import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { files } from "~/server/db/schema";

export const fileRouter = createTRPCRouter({
	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(files).values({
				name: input.name,
				extension: "txt",
				createdById: ctx.session.user.id,
			});
		}),

	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.files.findMany();
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
