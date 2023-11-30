"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import type { IPagePost } from "~/app/r/[slug]/page";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { createCommentSchema } from "~/validation/createComment";
import { Textarea } from "../ui/textarea";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface IProps {
  post: IPagePost;
  setPost: Dispatch<SetStateAction<IPagePost | undefined>>;
}

export default function CreateComment({ post, setPost }: IProps) {
  const searchParams = useSearchParams();
  const [commentCreate, setCommentCreate] = useState<boolean>(false);

  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createCommentSchema>) {
    try {
      const { data } = await axios.post<IPagePost>(
        "/api/comment/create_comment",
        {
          ...values,
          postId: post.id,
        },
      );
      setPost({ ...post, ...data });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setCommentCreate(!!searchParams.get("comment"));
    }, 300);

    setTimeout(() => {
      setCommentCreate(false);
    }, 1500);
  }, []);

  return (
    <div
      className={`rounded-md border border-neutral-400/30 bg-neutral-500/30 p-4 dark:border-neutral-400/5 dark:bg-neutral-500/[0.02]`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid items-start gap-4 space-y-1"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    autoFocus={!!searchParams.get("comment")}
                    className={`max-h-36 text-sm transition-colors ${
                      commentCreate
                        ? "dark:border-neutral-400"
                        : "dark:border-neutral-400/5"
                    }`}
                    placeholder="Talk about something..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="!mt-0 min-w-[140px]"
            disabled={!form.formState.isValid}
          >
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
}
