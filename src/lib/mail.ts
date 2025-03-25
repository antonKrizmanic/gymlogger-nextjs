import { Resend } from 'resend';
import VerifyEmail from '../../emails/verify-email';

let resend: Resend | null = null;

function getResend() {
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `https://localhost:3000/auth/new-verification?token=${token}`;

    await getResend().emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email",        
        react: VerifyEmail({ email, confirmLink }),
    });
}