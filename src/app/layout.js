import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
});

export const metadata = {
  title: 'CineStash — Your Content Vault',
  description: 'Track movies, series, anime, games & books. Discover, save, and share your watchlist.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${poppins.variable} min-h-screen font-body antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#16213e',
                  color: '#f1f1f1',
                  border: '1px solid #0f3460',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: '#16213e' },
                },
                error: {
                  iconTheme: { primary: '#e94560', secondary: '#16213e' },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}