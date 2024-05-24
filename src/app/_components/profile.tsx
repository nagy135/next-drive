"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

export default function Profile({ session }: { session: Session }) {
	return (
		<div className="flex gap-1 items-center">

			<Avatar>
				<AvatarImage src={session?.user?.image ?? ""} />
				<AvatarFallback>...</AvatarFallback>
			</Avatar>
			<Link
				href={session?.user ? "/api/auth/signout" : "/api/auth/signin"}
				className="rounded-full bg-white/10 px-10 py-1 font-semibold no-underline transition hover:bg-white/20"
			>
				<Button>
					{session?.user ? "Sign out" : "Sign in"}
				</Button>
			</Link>
		</div>
	);
}
