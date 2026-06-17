import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="manifest" href="/admin-manifest.json" />
        <meta name="apple-mobile-web-app-title" content="IHBS Admin" />
      </head>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:pl-56">{children}</div>
      </div>
    </>
  );
}