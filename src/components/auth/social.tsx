"use client";

import { signIn } from 'next-auth/react';

import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';

import { DEFAULT_LOGIN_REDIRECT } from '@/src/routes';
import { Button } from "../ui/button";

export const Social = () => {

    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT,
        });
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-1/2 hover:cursor-pointer hover:border-accent hover:bg-accent hover:text-white transition-all duration-500"
                variant="outline"
                onClick={() => onClick("google")}
            >
                <SiGoogle />
            </Button>
            <Button
                size="lg"
                className="w-1/2 hover:cursor-pointer hover:border-accent hover:bg-accent hover:text-white transition-all duration-500"
                variant="outline"
                onClick={() => onClick("github")}
            >
                <SiGithub />
            </Button>
        </div>
    );
}