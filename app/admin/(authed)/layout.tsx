import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "../_components/sidebar";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-bg-2 text-ink lg:flex">
      <AdminSidebar session={session} />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
