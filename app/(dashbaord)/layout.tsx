import LeftSidebar from "@/components/dashboard/left-sidebar";
import TopHeader from "@/components/dashboard/top-header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white h-screen flex justify-between">
      <LeftSidebar />
      <main className="w-full overflow-hidden">
        <TopHeader />
        {children}
      </main>
    </div>
  );
}
