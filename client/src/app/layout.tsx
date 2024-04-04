import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
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
            <body className={inter.className}>
                <Header />
                {children}
                <ToastContainer />
            </body>
        </html>
    )
}
