"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useAuthStore } from "~/store/auth";
import type { IUser } from "~/types/user";
import { editProfileSchema } from "~/validation/editProfile";

export default function EditProfile() {
  const [open, setOpen] = useState(false);
  const { user, authUserFn } = useAuthStore();
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name.split(" ")[0] ?? "",
      surname: user?.name.split(" ")[1] ?? "",
      image: user?.image ?? "",
      desc: user?.desc,
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    try {
      const { data } = await axios.post<IUser>("/api/update_profile", {
        ...values,
        id: user?.id,
      });
      authUserFn(data.id);
      setOpen(false);
    } catch (error) {
      authUserFn(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="mr-4 h-7 w-7 p-1.5">
          <Pencil strokeWidth={1.25} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            {`Make changes to your profile here. Click
                                    save when you're done.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-sm">Name</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-sm">
                      Surname
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input placeholder="Surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-sm">
                      Avatar Url
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input placeholder="Avatar Url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="translate-y-2 text-right text-sm">
                      Description
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Textarea
                          className="max-h-36"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
