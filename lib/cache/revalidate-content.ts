import { revalidateTag } from "next/cache";

export function revalidatePublishedContent() {
  revalidateTag("published-curriculum");
  revalidateTag("published-hiragana");
  revalidateTag("published-katakana");
}
