import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import 'react-toastify/dist/ReactToastify.css'
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
                <body className={inter.className}>
                    <Header />
                    {children}
                    <ToastContainer autoClose={2500} />
                </body>
            </AuthProvider>
        </html>
    )
}
