"use client";

import { LoginForm } from "@/src/components/Auth/login-form";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  return (
    <LoginForm />
  );
}