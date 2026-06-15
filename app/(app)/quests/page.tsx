import { redirect } from "next/navigation";

/** Quest board lives at camp (Doc 12 Screen 12) — deep link opens camp quest sheet. */
export default function QuestsRedirectPage() {
  redirect("/camp?quests=1");
}
