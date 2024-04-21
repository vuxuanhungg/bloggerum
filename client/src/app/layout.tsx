import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { AuthProvider } from './context/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <AuthProvider>
                <body
                    className={`${inter.className} flex min-h-screen flex-col`}
                >
                    <Header />
                    {children}
                    <div className="mt-auto">
                        <Footer />
                    </div>
                    <ToastContainer autoClose={2500} />
                </body>
            </AuthProvider>
        </html>
    )
}
