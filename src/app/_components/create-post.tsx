"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
	return (
		<SessionProvider>
			<AuthWrapped />
		</SessionProvider>
	);
}
function AuthWrapped() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [name, setName] = useState("");

	const createPost = api.post.create.useMutation({
		onSuccess: () => {
			router.refresh();
			setName("");
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				createPost.mutate({ name });
			}}
			className="flex flex-col gap-2"
		>
			<input
				type="text"
				placeholder="Title"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="w-full rounded-full px-4 py-2 text-black"
			/>
			<button
				type="submit"
				className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
				disabled={createPost.isPending}
			>
				{createPost.isPending ? "Submitting..." : "Submit"}
			</button>
			<div>{JSON.stringify(session)}</div>
		</form>
	);
}
