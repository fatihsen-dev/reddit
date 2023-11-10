"use client";

import { useForm } from "react-hook-form";
import type z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AiFillGithub } from "react-icons/ai";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { loginSchema } from "~/validation/login";

type ResponseT = {
  error: string | undefined;
  status: number;
  ok: boolean;
  url: string | null;
};

export default function Page() {
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const response = (await signIn("credentials", {
      redirect: false,
      ...values,
    })) as ResponseT;
    if (!response.ok) {
      toast({
        variant: "destructive",
        description: "Credentials do not match!",
      });
    } else {
      toast({
        description: "You're logged in, welcome 😊",
      });
      if (callback) {
        router.replace(callback);
      } else {
        router.replace("/");
      }
    }
  }

  return (
    <div className="flex items-start justify-center pt-28">
      <div className="w-full max-w-md rounded-md border p-5 px-6 shadow">
        <h1 className="mb-1 text-xl font-medium">Sign In</h1>
        <span className="text-sm opacity-50">{"Choose your login method"}</span>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 grid gap-4 space-y-1"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="USERNAME" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="***********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.formState.isValid}>
              Sign In
            </Button>
          </form>
        </Form>
        <div className="mt-5 grid gap-5">
          <hr className="border" />
          <Button
            type="button"
            variant={"secondary"}
            className="!w-full gap-1.5"
            onClick={async () => {
              await signIn("github", {
                callbackUrl: callback ? callback : "/",
              });
            }}
          >
            <AiFillGithub className="text-xl" />
            Sign In With Github
          </Button>
          <Link href="/register">
            <Button type="button" variant={"link"} className="!w-full gap-1.5">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
