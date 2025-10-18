import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';

const AuthErrorPage = () => {
    return (
        <Card className="w-full border-0 shadow-2xl backdrop-blur-sm bg-card/95">
            <CardHeader className="space-y-4 pb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-destructive" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                        Authentication Error
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Something went wrong during authentication
                    </p>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
                <p className="text-center text-muted-foreground">
                    We encountered an issue while processing your authentication
                    request. Please try again or contact support if the problem
                    persists.
                </p>
                <div className="flex flex-col space-y-3">
                    <Button
                        asChild
                        size="lg"
                        className="h-12 text-lg font-semibold"
                    >
                        <Link href="/auth/login">Try Again</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-12 text-lg font-semibold"
                    >
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AuthErrorPage;
