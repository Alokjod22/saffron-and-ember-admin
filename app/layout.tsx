import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import ToastNotification from '@/components/ui/ToastNotification';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'Saffron & Ember | Owner Admin Portal',
  description: 'Executive Management & Operational Control for Saffron & Ember Restaurant',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="bg-charcoal-950 text-cream-100 font-sans antialiased min-h-screen flex selection:bg-saffron-500 selection:text-charcoal-950">
        <AuthProvider>
          <CartProvider>
            <div className="flex w-full min-h-screen">
              <AdminSidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <AdminHeader />
                <ToastNotification />
                <main className="p-6 md:p-8 flex-1">{children}</main>
              </div>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
