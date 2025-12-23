'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Goal {
    id: number;
    title: string;
    progress: number;
}

export default function GoalsPage() {
    const { user, loading } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoal, setNewGoal] = useState('');
    const router = useRouter();

    const fetchGoals = () => {
        fetch('/api/goals')
            .then(res => {
                if (res.status === 401) router.push('/login');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setGoals(data);
            });
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchGoals();
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    const addGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newGoal })
        });
        setNewGoal('');
        fetchGoals();
    };

    const updateProgress = async (id: number) => {
        await fetch('/api/goals', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        fetchGoals();
    };

    const deleteGoal = async (id: number) => {
        if (!confirm('Delete goal?')) return;
        await fetch('/api/goals', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        fetchGoals();
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-8 mt-6">
                <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">My Goals</h1>
                <form onSubmit={addGoal} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="New Goal..."
                        required
                        className="flex-1 p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Add</button>
                </form>
            </div>

            <div className="space-y-4 mb-12">
                {goals.map(goal => (
                    <div key={goal.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center justify-between">
                        <div className="flex-1 pr-4">
                            <div className="font-semibold text-lg dark:text-white">{goal.title}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Progress: {goal.progress}%</div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded">
                                <div className="bg-green-500 h-2 rounded transition-all duration-500" style={{ width: `${goal.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {goal.progress < 100 ? (
                                <button onClick={() => updateProgress(goal.id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">+10%</button>
                            ) : (
                                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded">Done</span>
                            )}
                            <button onClick={() => deleteGoal(goal.id)} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors">Del</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
