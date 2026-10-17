import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopHeading from '../_components/ShopHeading';
import CompleteView from './CompleteView';

export const metadata: Metadata = { title: 'ORDER', robots: { index: false } };

export default function CompletePage() {
  return (
    <div className="bg-cream min-h-screen pb-20">
      <ShopHeading eyebrow="Order" title="ORDER" bg="ORDER" />
      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        <Suspense>
          <CompleteView />
        </Suspense>
      </div>
    </div>
  );
}
