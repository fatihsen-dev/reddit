"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useAuthStore } from "~/store/auth";
import type { IPost } from "~/types/post";
import { createPostSchema } from "~/validation/createPost";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";

type IExtendtedPost = IPost & {
  user: { username: string };
  _count: {
    votes: number;
    unVotes: number;
    comments: number;
  };
};

interface IProps {
  setPosts: Dispatch<SetStateAction<IExtendtedPost[]>>;
  posts: IExtendtedPost[];
}

export default function PostCreate({ setPosts, posts }: IProps) {
  const { user } = useAuthStore();
  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createPostSchema>) {
    try {
      const { data } = await axios.post<IExtendtedPost>("/api/create_post", {
        userId: user?.id,
        ...values,
      });
      setPosts([data, ...posts]);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="rounded-md border border-neutral-400/30 bg-neutral-500/30 p-4 dark:border-neutral-400/5 dark:bg-neutral-500/[0.02]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 space-y-1"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="max-h-56 min-h-[8rem]"
                    placeholder="Talk about something..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-[1fr_260px]">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="h-[1.10rem] w-[1.10rem] rounded"
              />
              <label
                htmlFor="terms"
                className="cursor-pointer select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Friends Only
              </label>
            </div>
            <Button type="submit" disabled={!form.formState.isValid}>
              Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
