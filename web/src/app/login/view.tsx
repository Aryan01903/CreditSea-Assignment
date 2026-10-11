"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/api";
import { login } from "@/lib/auth";
import { homeRouteForRole } from "@/lib/constants";

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (user) => router.replace(homeRouteForRole(user.role)),
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">LoanPilot</h1>
        <p className="mt-1 text-center text-sm text-gray-500">Sign in to your account</p>
        <Card className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMutation.isError && (
              <Alert tone="error" title={getErrorMessage(loginMutation.error, "Unable to log in")} />
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <Button
              type="submit"
              loading={loginMutation.isPending || loginMutation.isSuccess}
              className="w-full"
            >
              Sign in
            </Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-gray-600">
          New borrower?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
