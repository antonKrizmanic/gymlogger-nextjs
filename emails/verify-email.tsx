import {
    Head,
    Html,
    Preview,
    Section, Tailwind,
} from '@react-email/components';
import { ContentCard } from './components/content-card';
import { Header } from './components/header';
import { Paragraph } from './components/paragraph';
import { PrimaryButton } from './components/primary-button';
import { Divider } from './components/divider';
import { Disclaimer } from './components/disclaimer';

export interface VerifyEmailProps {
    email: string;    
    confirmLink: string;
}

export default function VerifyEmail({ email, confirmLink }: VerifyEmailProps) {    
    return (
        <Html>
            <Head />
            <Preview>Please verify your email address</Preview>
            <Tailwind>
                <ContentCard>                    
                    <Header>Email verification</Header>
                    <Paragraph>Before you start to use GymNotebook, you need to verify your email address: <strong>{email}</strong></Paragraph>
                    <Paragraph>To verify your email, please click the button below:</Paragraph>                    
                    <Section className="my-[32px] text-center">
                        <PrimaryButton href={confirmLink}>Verify email</PrimaryButton>
                    </Section>                    
                    <Divider className="my-[26px]" />
                    <Disclaimer>
                        This email was sent to you because you created an account on{' '}
                        <span className="text-black">{process.env.NEXT_PUBLIC_APP_NAME}</span>.
                        If you didn't expect this confirmation, you can ignore this email.
                    </Disclaimer>
                </ContentCard>
            </Tailwind>
        </Html>
    );
}