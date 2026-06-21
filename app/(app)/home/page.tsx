import { redirect } from "next/navigation";

/** D1: Doc 02 — Journey is the primary experience; post-auth landing. */
export default function HomeRedirectPage() {
  redirect("/tree");
}
