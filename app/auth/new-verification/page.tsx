import { Suspense } from 'react';
import { NewVerificationForm } from '@/src/components/auth/new-verification';

export default async function NewVerificationPage() {
    return (
        <Suspense>
            <NewVerificationForm />
        </Suspense>
    );
}
