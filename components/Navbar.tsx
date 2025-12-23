'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';

export default function Navbar() {
    const { user, logout } = useAuth();
    // const [isOpen, setIsOpen] = useState(false); // Mobile menu state no longer needed

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-blue-600 dark:bg-gray-900 text-white py-1 px-4 shadow-md sticky top-0 z-50 transition-colors duration-300">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold flex items-center gap-2">
                    <Image
                        src={logo}
                        alt="MindWell Logo"
                        className="w-12 h-12 object-contain"
                    />
                    MindWell
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-4">
                    {user ? (
                        <>
                            <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
                            <li><Link href="/moods" className="hover:underline">Moods</Link></li>
                            <li><Link href="/journal" className="hover:underline">Journal</Link></li>
                            <li><Link href="/goals" className="hover:underline">Goals</Link></li>
                            <li><Link href="/settings" className="hover:underline">Settings</Link></li>
                            <li><button onClick={handleLogout} className="hover:underline text-blue-100 border-l border-blue-400 pl-4 ml-2">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link href="/login" className="hover:underline">Login</Link></li>
                            <li><Link href="/register" className="hover:underline">Register</Link></li>
                        </>
                    )}
                </ul>

                {/* Mobile Menu Button - Removed in favor of BottomNav */}
            </nav>

            {/* Mobile Menu - Removed in favor of BottomNav */}

        </header>
    );
}
