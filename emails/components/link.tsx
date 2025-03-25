import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Link as RELink } from '@react-email/components';

export function Link({ children, href }: PropsWithChildren<{ href: string; }>) {
    return (
        <RELink
            href={href}
            className="text-[#a1a1a1] no-underline"
        >
            {children}
        </RELink>
    );
}