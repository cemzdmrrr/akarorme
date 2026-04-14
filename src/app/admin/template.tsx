'use client';

import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { initializeStore } from '@/lib/admin-store';
import { isAuthenticated, logout } from '@/lib/auth';

interface AdminCtx {
  toggleSidebar: () => void;
  handleLogout: () => void;
}
const Ctx = createContext<AdminCtx>({ toggleSidebar: () => {}, handleLogout: () => {} });
export function useAdminContext() { return useContext(Ctx); }

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    initializeStore();
    let cancelled = false;
    isAuthenticated().then((ok) => {
      if (cancelled) return;
      setAuthed(ok);
      if (!ok && !isLoginPage) {
        router.replace('/admin/login');
      }
    });
    return () => { cancelled = true; };
  }, [pathname, isLoginPage, router]);

  const toggle = useCallback(() => setSidebarOpen((o) => !o), []);
  const close = useCallback(() => setSidebarOpen(false), []);
  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/admin/login');
  }, [router]);

  // Login page renders without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading / redirect state
  if (authed === null || authed === false) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ toggleSidebar: toggle, handleLogout }}>
      <div className="flex h-screen bg-gray-50 text-gray-900 antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <AdminSidebar open={sidebarOpen} onClose={close} />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </Ctx.Provider>
  );
}
