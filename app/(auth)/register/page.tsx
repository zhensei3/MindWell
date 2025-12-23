'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (_err) {
            setError('An unexpected error occurred');
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
            <div className="hidden md:block md:w-2/3 relative">
                <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover">
                    <source src="/assets/background.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-0 left-0 w-full h-full bg-blue-900/30"></div>
                <div className="absolute bottom-10 left-10 text-white z-10">
                    <h2 className="text-4xl font-bold mb-2">Start Your Journey.</h2>
                    <p className="text-lg opacity-90">Join MindWell and take control of your well-being.</p>
                </div>
            </div>

            <div className="w-full md:w-1/3 flex items-center justify-center p-8 bg-white dark:bg-gray-900 relative z-10">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Create Account</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">It only takes a minute to join.</p>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded border border-red-200 dark:border-red-800 mb-4 text-sm">{error}</div>
                    )}
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-3 rounded border border-green-200 dark:border-green-800 mb-4 text-sm">
                            {success} <Link href="/login" className="underline font-bold">Login</Link>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                            Register
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
