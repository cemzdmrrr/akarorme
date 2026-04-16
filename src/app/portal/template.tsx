'use client';

import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PortalSidebar from '@/components/portal/PortalSidebar';
import { getB2BSession, b2bLogout } from '@/lib/b2b-auth';
import { initializeB2BStore, getClient } from '@/lib/b2b-store';
import type { B2BClient } from '@/types/b2b';

interface PortalCtx {
  client: B2BClient | null;
  toggleSidebar: () => void;
  handleLogout: () => void;
}

const Ctx = createContext<PortalCtx>({ client: null, toggleSidebar: () => {}, handleLogout: () => {} });

export function usePortalContext() {
  return useContext(Ctx);
}

const PUBLIC_PATHS = ['/portal/login', '/portal/register', '/portal/reset-password'];

export default function PortalTemplate({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [client, setClient] = useState<B2BClient | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    initializeB2BStore();
    const session = getB2BSession();
    if (session) {
      const currentClient = getClient(session.clientId);
      if (currentClient && currentClient.status === 'approved') {
        setClient(currentClient);
        setAuthed(true);
      } else {
        b2bLogout();
        setAuthed(false);
        if (!isPublicPage) router.replace('/portal/login');
      }
    } else {
      setAuthed(false);
      if (!isPublicPage) router.replace('/portal/login');
    }
  }, [pathname, isPublicPage, router]);

  const toggle = useCallback(() => setSidebarOpen((open) => !open), []);
  const close = useCallback(() => setSidebarOpen(false), []);
  const handleLogout = useCallback(() => {
    b2bLogout();
    router.replace('/portal/login');
  }, [router]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (authed === null || authed === false) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ client, toggleSidebar: toggle, handleLogout }}>
      <div className="flex h-screen bg-brand-black font-body text-brand-white antialiased">
        <PortalSidebar open={sidebarOpen} onClose={close} client={client} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-brand-dark-3 bg-brand-dark px-6 py-3 lg:hidden">
            <button onClick={toggle} className="text-brand-grey transition-colors hover:text-white" aria-label="Menü">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-display text-sm font-bold tracking-wider">AKAR ÖRME</span>
            <div className="w-6" />
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </Ctx.Provider>
  );
}
