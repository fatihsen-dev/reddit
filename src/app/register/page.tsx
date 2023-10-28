"use client";

import { useForm } from "react-hook-form";
import type z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { registerSchema } from "~/validation/register";

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = (await response.json()) as { message: string };
    if (!response.ok) {
      toast({
        variant: "destructive",
        description: data.message,
      });
    } else {
      toast({
        description: data.message,
      });
      router.replace("/login");
    }
  }

  return (
    <div className="flex items-start justify-center pt-14">
      <div className="w-full max-w-xl rounded-md border p-5 px-6 shadow">
        <h1 className="mb-1 text-xl font-medium">Sign Up</h1>
        <span className="text-sm opacity-50">Choose your register method</span>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 grid gap-4 space-y-0.5"
          >
            <div className="flex w-full items-center gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input placeholder="Surname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      {...field}
                    />
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
              Sign Up
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
              await signIn("github", { callbackUrl: "/" });
            }}
          >
            <AiFillGithub className="text-xl" />
            Sign Up With Github
          </Button>
          <Link href="/login">
            <Button type="button" variant={"link"} className="!w-full gap-1.5">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
