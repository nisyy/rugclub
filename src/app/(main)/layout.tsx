import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SplashScreen from '@/components/ui/SplashScreen';
import { CartProvider } from '@/components/shop/CartProvider';
import { ToastProvider } from '@/components/shop/ToastProvider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <ToastProvider>
      <div className="relative">
        <SplashScreen />
        <PageViewTracker />
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
      </ToastProvider>
    </CartProvider>
  );
}
