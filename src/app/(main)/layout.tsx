import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SplashScreen from '@/components/ui/SplashScreen';
import { CartProvider } from '@/components/shop/CartProvider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="relative">
        <SplashScreen />
        <PageViewTracker />
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
