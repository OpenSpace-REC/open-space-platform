'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/components/user-context';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const AdminPage: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [projectIdToDelete, setProjectIdToDelete] = useState('');
    const [banUserEmail, setBanUserEmail] = useState('');
    const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);
    const [adminOnlyAccess, setAdminOnlyAccess] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role !== 'ADMIN') {
                router.push('/dashboard');
            } else {
                setIsLoading(false);
            }
        }
    }, [user, router]);

    useEffect(() => {

        fetch('/api/admin/toggle-leaderboard')
            .then(res => res.json())
            .then(data => {
                setLeaderboardEnabled(data.leaderboardEnabled);
            })
            .catch(error => {
                console.error('Error fetching leaderboard status:', error);
            });


        fetch('/api/admin/toggle-platform-access')
            .then(res => res.json())
            .then(data => {
                setAdminOnlyAccess(data.adminOnlyAccess);
            })
            .catch(error => {
                console.error('Error fetching platform access status:', error);
            });
    }, []);

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/delete-project`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projectId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            toast.success('Project deleted successfully');
            setProjectIdToDelete(''); 
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    const handleUpdateUser = async () => {
        try {
            const response = await fetch('/api/admin/update-user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    role: selectedRole,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            toast.success('User role updated successfully');
            setEmail('');
            setSelectedRole('');
        } catch (error) {
            toast.error('Failed to update user role');
            console.error('Error updating user:', error);
        }
    };

    const handleUpdateUserBanStatus = async (email: string, banned: boolean) => {
        if (!confirm(`Are you sure you want to ${banned ? 'ban' : 'unban'} this user?`)) {
            return;
        }

        try {
            const response = await fetch('/api/admin/update-user-ban-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, banned }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update user ban status');
            }

            toast.success(`User ${banned ? 'banned' : 'unbanned'} successfully`);
            setBanUserEmail('');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update user ban status';
            toast.error(errorMessage);
        }
    };

    const handleLeaderboardToggle = async () => {
        try {
            const response = await fetch('/api/admin/toggle-leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to toggle leaderboard');
            }

            const data = await response.json();
            setLeaderboardEnabled(data.leaderboardEnabled);
            toast.success(`Leaderboard is now ${data.leaderboardEnabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error('Failed to toggle leaderboard');
        }
    };

    const handlePlatformAccessToggle = async () => {
        try {
            const response = await fetch('/api/admin/toggle-platform-access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to toggle platform access');
            }

            const data = await response.json();
            setAdminOnlyAccess(data.adminOnlyAccess);
            toast.success(`Platform access is now ${data.adminOnlyAccess ? 'restricted to admins' : 'open to all users'}`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while toggling platform access';
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="space-y-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Platform Access Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Switch
                                    checked={adminOnlyAccess}
                                    onCheckedChange={handlePlatformAccessToggle}
                                />
                                <span>
                                    Platform access is {adminOnlyAccess ? 'restricted to admins' : 'open to all users'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Leaderboard Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Switch
                                    checked={leaderboardEnabled}
                                    onCheckedChange={handleLeaderboardToggle}
                                />
                                <span>
                                    Leaderboard is currently {leaderboardEnabled ? 'enabled' : 'disabled'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Update User Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input
                                placeholder="User Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleUpdateUser}>Update Role</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ban/Unban User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input
                                placeholder="Enter User Email"
                                value={banUserEmail}
                                onChange={(e) => setBanUserEmail(e.target.value)}
                            />
                            <div className="flex space-x-4">
                                <Button 
                                    variant="destructive"
                                    onClick={() => handleUpdateUserBanStatus(banUserEmail, true)}
                                    disabled={!banUserEmail}
                                >
                                    Ban User
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => handleUpdateUserBanStatus(banUserEmail, false)}
                                    disabled={!banUserEmail}
                                >
                                    Unban User
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Delete Project by ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input
                                placeholder="Enter Project ID"
                                value={projectIdToDelete}
                                onChange={(e) => setProjectIdToDelete(e.target.value)}
                            />
                            <Button 
                                variant="destructive"
                                onClick={() => handleDeleteProject(projectIdToDelete)}
                                disabled={!projectIdToDelete}
                            >
                                Delete Project
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminPage;
