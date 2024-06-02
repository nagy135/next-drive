import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./src/server/db/schema";

import * as dotenv from 'dotenv'
dotenv.config()

const conn = postgres(process.env.DATABASE_URL ?? "");

export const db = drizzle(conn, { schema });


const seed = async () => {
	console.log('seeding...');

	const ALICE_ID = '1';
	await db.insert(schema.users).values({
		id: ALICE_ID,
		name: "Alice",
		email: "alice@alice.com",
		emailVerified: new Date(),
	})

	const JOHN_ID = '2';
	await db.insert(schema.users).values({
		id: JOHN_ID,
		name: "John",
		email: "jogn@john.com",
		emailVerified: new Date(),
	})


	await db.transaction(async (tx) => {
		await tx.insert(schema.files).values({
			id: 1,
			name: "file.txt",
			createdById: ALICE_ID,
			public: true,
			order: 1,
			createdAt: new Date(),
		})

		await tx.insert(schema.files).values({
			id: 2,
			name: "file2.txt",
			createdById: JOHN_ID,
			public: true,
			order: 1,
			createdAt: new Date(),
		})
	})
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log('Seeding done!');
		process.exit(0);
	});
