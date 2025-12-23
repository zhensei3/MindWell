'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

interface Entry {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export default function JournalPage() {
    const { user, loading } = useAuth();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const router = useRouter();

    const fetchEntries = (p = 1, searchQuery = '') => {
        fetch(`/api/journal?page=${p}&search=${searchQuery}`)
            .then(res => {
                if (res.status === 401) router.push('/login');
                return res.json();
            })
            .then(data => {
                if (data.entries) {
                    setEntries(data.entries);
                    setTotalPages(data.totalPages);
                    setPage(data.page);
                }
            });
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchEntries();
        }
    }, [user, loading, router]);

    // ... imports remain the same

    // inside default function JournalPage() starts at line 19
    // ... (state declarations)

    if (loading || !user) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-6 grid md:grid-cols-3 gap-6 md:gap-8 pb-24 md:pb-6">
                <div className="md:col-span-1 mb-6 md:mb-0">
                    <Card className="sticky top-20 md:top-6 space-y-4">
                        <Skeleton className="h-6 w-32" /> {/* Title Label */}
                        <Skeleton className="h-10 w-full" /> {/* Title Input */}
                        <Skeleton className="h-6 w-32" /> {/* Thoughts Label */}
                        <Skeleton className="h-32 w-full" /> {/* Textarea */}
                        <Skeleton className="h-10 w-full" /> {/* Button */}
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-10 w-64" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = '/api/journal';
        const method = editingId ? 'PUT' : 'POST';
        const body: any = { title, content };
        if (editingId) body.id = editingId;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        setTitle('');
        setContent('');
        setEditingId(null);
        fetchEntries(page, search);
    };

    const handleEdit = (entry: Entry) => {
        setTitle(entry.title);
        setContent(entry.content);
        setEditingId(entry.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this entry?')) return;
        await fetch('/api/journal', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        fetchEntries(page, search);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchEntries(1, search);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 grid md:grid-cols-3 gap-6 md:gap-8 pb-24 md:pb-6">
            <div className="md:col-span-1 mb-6 md:mb-0">
                <Card className="sticky top-20 md:top-6">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">{editingId ? 'Edit Entry' : 'New Entry'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label>Title</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <Label>Thoughts</Label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} required className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"></textarea>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1">
                                {editingId ? 'Update' : 'Save'}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-2xl font-bold dark:text-white">My Journal</h2>
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 sm:flex-none w-full sm:w-64" />
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>
                </div>

                {entries.length > 0 ? entries.map(entry => (
                    <Card key={entry.id} className="relative group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 break-words">{entry.title}</h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap ml-2">{new Date(entry.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed break-words">{entry.content}</p>
                        <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            {/* Always visible on mobile, hover on desktop */}
                            <button onClick={() => handleEdit(entry)} className="text-blue-500 dark:text-blue-400 hover:underline text-sm font-medium">Edit</button>
                            <button onClick={() => handleDelete(entry.id)} className="text-red-500 dark:text-red-400 hover:underline text-sm font-medium">Delete</button>
                        </div>
                    </Card>
                )) : <Card className="text-center py-12"><p className="text-gray-500">No entries found.</p></Card>}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6 mb-20 md:mb-0">
                        <Button disabled={page <= 1} onClick={() => fetchEntries(page - 1, search)} variant="outline">Previous</Button>
                        <span className="px-4 py-2 text-gray-500 dark:text-gray-400 flex items-center">Page {page} of {totalPages}</span>
                        <Button disabled={page >= totalPages} onClick={() => fetchEntries(page + 1, search)} variant="outline">Next</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
