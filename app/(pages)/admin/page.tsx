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

const AdminPage: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        if (user) {
            if (user.role !== 'ADMIN') {
                router.push('/dashboard');
            } else {
                setIsLoading(false);
            }
        }
    }, [user, router]);

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        User Email
                    </label>
                    <Input
                        type="email"
                        placeholder="Enter user email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Role
                    </label>
                    <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="CURATOR">Curator</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={handleUpdateUser}
                    disabled={!email || !selectedRole}
                >
                    Update User Role
                </Button>
            </div>
        </div>
    );
};

export default AdminPage;
