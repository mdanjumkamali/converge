import LeftSidebar from "@/components/dashboard/left-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white h-screen flex justify-between">
      <LeftSidebar />
      <main className="w-full">{children}</main>
    </div>
  );
}
