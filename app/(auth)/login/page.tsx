'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { checkAuth } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                await checkAuth(); // Update context
                router.push('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (_err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
            {/* Left Side: Video Background */}
            <div className="hidden md:block md:w-2/3 relative">
                <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover">
                    <source src="/assets/background.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-0 left-0 w-full h-full bg-blue-900/30"></div>
                <div className="absolute bottom-10 left-10 text-white z-10">
                    <h2 className="text-4xl font-bold mb-2">Welcome Back.</h2>
                    <p className="text-lg opacity-90">Track your journey to better mental health.</p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full md:w-1/3 flex items-center justify-center p-8 bg-white dark:bg-gray-900 relative z-10">
                <Card className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">MindWell Login</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Please enter your details to sign in.</p>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded border border-red-200 dark:border-red-800 mb-4 text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account? <Link href="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Register</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
