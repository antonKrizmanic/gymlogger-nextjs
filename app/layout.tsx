import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/src/components/theme-provider';
import './globals.css';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: 'GymNotebook - Your Fitness Journey Starts Here',
    description:
        'Transform your fitness journey with our intelligent workout tracking, progress analytics, and personalized training insights.',
    keywords: [
        'fitness',
        'workout',
        'gym',
        'training',
        'progress tracking',
        'exercise',
    ],
    authors: [{ name: 'GymNotebook Team' }],
    viewport: 'width=device-width, initial-scale=1',
    icons: {
        icon: [
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} font-sans antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-right" richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
