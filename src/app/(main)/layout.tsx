import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SplashScreen from '@/components/ui/SplashScreen';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <SplashScreen />
      <PageViewTracker />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
