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
import { register } from "@/lib/auth";

export function RegisterView() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: () => register(name, email, password),
    onSuccess: () => router.replace("/portal"),
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    registerMutation.mutate();
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Apply for a loan with LoanPilot in a few simple steps
        </p>
        <Card className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {registerMutation.isError && (
              <Alert
                tone="error"
                title={getErrorMessage(registerMutation.error, "Unable to create account")}
              />
            )}
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
            />
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
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <Button
              type="submit"
              loading={registerMutation.isPending || registerMutation.isSuccess}
              className="w-full"
            >
              Sign up
            </Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
