import type { Metadata } from 'next';
import { ClientLayout } from '@/app/components/ClientLayout';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Elite Flower - Цэцгийн дэлгүүр',
  description: 'Улаанбаатар хотод хүргэлттэй цэцэг, баглаа, бэлэг',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
