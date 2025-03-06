'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BannedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl text-destructive">Account Banned</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-muted-foreground">
                        Your account has been banned from accessing the platform. If you believe this is a mistake,
                        please contact the administrators.
                    </p>
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/')}
                        >
                            Return to Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
