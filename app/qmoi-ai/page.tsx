import { redirect } from "next/navigation";

export default function Page() {
  // Redirect the Next.js route to the public QMOI AI static app shell.
  redirect("/qmoi-ai.html?live=1");
}
