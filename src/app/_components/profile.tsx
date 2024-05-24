import { Session } from "next-auth";
import Link from "next/link";

export default function Profile({ data }: { data: Session["user"] }) {
	return (
		<div className="flex gap-3 items-center">
			<img src={data.image ?? ""} alt="" className="h-10 w-10" />
			<Link
				href={data ? "/api/auth/signout" : "/api/auth/signin"}
				className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
			>
				{data ? "Sign out" : "Sign in"}
			</Link>
		</div>
	);
}
