import type { Metadata, Viewport } from 'next';
import './globals.css';
import ServiceWorkerRegistration from '@/components/layout/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: 'IHBS - 대학 방송국',
  description: 'IHBS 방송국 공식 앱. 방송 편성표, 사연 보내기, 신청곡, 플레이리스트를 확인하세요.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IHBS',
  },
  icons: {
    apple: '/icons/apple-touch-icon.svg',
    icon: '/icons/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a3a6b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IHBS" />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}