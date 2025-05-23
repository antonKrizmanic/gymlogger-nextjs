import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Button } from '@react-email/components';

export function PrimaryButton({ href, children }: PropsWithChildren<{ href: string; }>) {
    return (
        <Button
            className="rounded bg-black px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
            href={href}
        >
            {children}
        </Button>
    );
}