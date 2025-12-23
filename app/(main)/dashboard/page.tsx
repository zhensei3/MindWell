'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Smile, Book, Target } from 'lucide-react';
import Link from 'next/link';
import MoodChart from '@/components/MoodChart';

interface Mood {
    created_at: string;
    mood_score: number;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const [quote, setQuote] = useState('');
    const [moodData, setMoodData] = useState<Mood[]>([]);
    const [loadingMoods, setLoadingMoods] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            const quotes = [
                "The only journey is the one within.",
                "Mental health is not a destination, but a process.",
                "You are enough just as you are.",
                "Breathe. It’s just a bad day, not a bad life.",
                "Small steps every day."
            ];
            setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

            // Fetch recent moods for chart
            fetch('/api/moods?limit=7')
                .then(res => res.json())
                .then(data => {
                    if (data.moods) setMoodData(data.moods);
                })
                .catch(err => console.error(err))
                .finally(() => setLoadingMoods(false));
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="p-8 max-w-6xl mx-auto space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-64" /> {/* Welcome Message */}
                    <Skeleton className="h-6 w-96" /> {/* Subtitle */}
                </div>

                <Card className="p-6 text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto mb-4" /> {/* Quote */}
                    <Skeleton className="h-4 w-32 mx-auto" /> {/* Quote Label */}
                </Card>

                <Skeleton className="h-[400px] w-full rounded-xl" /> {/* Chart Skeleton */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back, {user.username}!</h1>
                <p className="text-gray-600 dark:text-gray-400">Here's your daily overview.</p>
            </header>

            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-l-4 border-blue-500">
                <blockquote className="text-xl italic text-gray-700 dark:text-gray-300 text-center">"{quote}"</blockquote>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">- Daily Wisdom</p>
            </Card>

            <div className="mb-8">
                {loadingMoods ? (
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                ) : (
                    <MoodChart data={moodData} />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/moods">
                    <Card className="hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center p-8 h-full bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 group">
                        <Smile className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-semibold dark:text-white">Track Mood</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center mt-2">How are you feeling today?</p>
                    </Card>
                </Link>

                <Link href="/journal">
                    <Card className="hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center p-8 h-full bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 group">
                        <Book className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-semibold dark:text-white">Journal</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center mt-2">Write down your thoughts.</p>
                    </Card>
                </Link>

                <Link href="/goals">
                    <Card className="hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center p-8 h-full bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 group">
                        <Target className="w-12 h-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-semibold dark:text-white">Goals</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center mt-2">Set and achieve new targets.</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
