import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageViewTracker from '@/components/analytics/PageViewTracker';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageViewTracker />
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}
