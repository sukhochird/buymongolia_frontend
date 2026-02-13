import type { Metadata } from 'next';
import { ClientLayout } from '@/app/components/ClientLayout';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Smart Buy Mongolia - Дижитал бүтээгдэхүүн',
  description: 'Дижитал бүтээгдэхүүн, үйлчилгээг Монголдоо хамгийн хямд, хамгийн найдвартай сонголт болгохын төлөө бид зогсолтгүй хөдөлмөрлөж байна. 🚀',
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
