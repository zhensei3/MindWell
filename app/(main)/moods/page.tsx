'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Skeleton } from '@/components/ui/Skeleton';
import { Smile, Frown, Meh } from 'lucide-react';

interface Mood {
    id: number;
    mood_score: number;
    note: string;
    created_at: string;
}

export default function MoodsPage() {
    const { user, loading } = useAuth();
    const [moods, setMoods] = useState<Mood[]>([]);
    const [score, setScore] = useState(5);
    const [note, setNote] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const fetchMoods = (p = 1) => {
        fetch(`/api/moods?page=${p}`)
            .then(res => {
                if (res.status === 401) router.push('/login');
                return res.json();
            })
            .then(data => {
                if (data.moods) {
                    setMoods(data.moods);
                    setTotalPages(data.totalPages);
                    setPage(data.page);
                }
            });
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchMoods();
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-8 w-40 mb-4" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    const addMood = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await fetch('/api/moods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood_score: score, note })
        });
        setNote('');
        fetchMoods(1);
        setIsSubmitting(false);
    };

    const getMoodIcon = (s: number) => {
        if (s >= 8) return <Smile className="text-green-500 w-8 h-8" />;
        if (s >= 5) return <Meh className="text-yellow-500 w-8 h-8" />;
        return <Frown className="text-red-500 w-8 h-8" />;
    };

    const getMoodColor = (s: number) => {
        if (s >= 8) return 'border-green-500 bg-green-50 dark:bg-green-900/10';
        if (s >= 5) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
        return 'border-red-500 bg-red-50 dark:bg-red-900/10';
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
            <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Mood Tracker</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1">
                    <Card className="sticky top-20 md:top-8">
                        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                            <Smile className="text-blue-500" /> Log Mood
                        </h2>
                        <form onSubmit={addMood} className="space-y-6">
                            <div>
                                <Label className="mb-4 block text-lg">How are you feeling? <span className="text-2xl font-bold ml-2 text-blue-600">{score}</span>/10</Label>
                                <input
                                    type="range" min="1" max="10" value={score}
                                    onChange={(e) => setScore(parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                                    <span>Bad</span>
                                    <span>Neutral</span>
                                    <span>Great</span>
                                </div>
                            </div>
                            <div>
                                <Label>Note (Optional)</Label>
                                <textarea
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none transition-all"
                                    placeholder="What influenced your mood today?"
                                ></textarea>
                            </div>
                            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                                Log Entry
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* History Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold dark:text-white">Start History</h2>
                    </div>

                    <div className="space-y-4">
                        {moods.length > 0 ? moods.map(mood => (
                            <Card key={mood.id} className={`border-l-4 transition-all hover:shadow-md ${getMoodColor(mood.mood_score)}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="mt-1">{getMoodIcon(mood.mood_score)}</div>
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-lg dark:text-gray-100">Score: {mood.mood_score}</span>
                                                <span className="text-xs text-gray-400">{new Date(mood.created_at).toLocaleString()}</span>
                                            </div>
                                            {mood.note && <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{mood.note}</p>}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )) : (
                            <Card className="text-center py-12 border-dashed border-2">
                                <p className="text-gray-500">No moods logged yet. Start tracking today!</p>
                            </Card>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <Button disabled={page <= 1} onClick={() => fetchMoods(page - 1)} variant="outline">Previous</Button>
                            <span className="px-4 py-2 text-gray-500 dark:text-gray-400 flex items-center">Page {page} of {totalPages}</span>
                            <Button disabled={page >= totalPages} onClick={() => fetchMoods(page + 1)} variant="outline">Next</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
