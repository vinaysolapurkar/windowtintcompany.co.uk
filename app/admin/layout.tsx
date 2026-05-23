// Root admin layout — minimal. The proxy guards /admin/* (except /admin/login).
// The authed shell lives in the (authed) route group.
import "./_components/admin-form.css";

export const metadata = {
  title: "Studio · Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-bg text-ink">{children}</div>;
}
