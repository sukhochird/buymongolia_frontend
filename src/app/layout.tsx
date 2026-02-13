import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { ClientLayout } from '@/app/components/ClientLayout';
import '@/app/globals.css';

const fontLogo = Outfit({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-logo',
  display: 'swap',
});

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
      <body className={fontLogo.variable}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
