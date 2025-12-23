'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Note: AuthContext user might not have email depending on implementation

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            setUsername(user.username);
            setEmail(user.email || '');
        }
    }, [user, loading, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSaving(true);

        // Validation for password
        if (newPassword && newPassword !== confirmPassword) {
            setError("New passwords don't match");
            setIsSaving(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Profile updated successfully');
                setPasswordFieldsEmpty();
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const setPasswordFieldsEmpty = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    if (loading || !user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 md:pb-24">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Profile Settings</h1>

            <Card>
                <h2 className="text-xl font-semibold mb-6 dark:text-white">Account Information</h2>

                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                        <Label>Username</Label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="border-t dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-medium mb-4 dark:text-gray-200">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <Label>Current Password <span className="text-sm font-normal text-gray-500">(Required to change)</span></Label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Confirm New Password</Label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            isLoading={isSaving}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
