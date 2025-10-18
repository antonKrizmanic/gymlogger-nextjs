/* eslint-disable tailwindcss/enforces-shorthand */
/* eslint-disable tailwindcss/classnames-order */

import { Body, Container } from '@react-email/components';
import type { PropsWithChildren } from 'react';

export function ContentCard({ children }: PropsWithChildren) {
    return (
        <Body className="bg-white my-auto mx-auto font-sans px-2">
            <Container className="my-[40px] mx-auto p-[20px] max-w-[465px]">
                {children}
            </Container>
        </Body>
    );
}
