"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import axios from "axios";
import { UseUserContext } from "../../context/UserContext";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { baseurl, user, setUser } = UseUserContext();
  let navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${baseurl}/users/login`, values);
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/");
      } else {
        toast.error("Error Occured");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container flex flex-col min-h-[90vh] h-full w-full items-center justify-center px-4 ">
      {isLoading && <Loader loaderText="Logging In" />}
      <Card className="mx-auto max-w-sm bg-[#1f2936] text-slate-300 border-none">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-slate-500">
            Please Login to your account to use our services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                          className="bg-[#1f2936] text-slate-300 placeholder:text-slate-400 focus:ring-primary focus:border-primary block w-full rounded-md border-gray-300 sm:text-sm"
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
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <button
                          type="button"
                          className="ml-auto inline-block text-sm underline text-blue-400 hover:text-blue-600"
                          // onClick={() => setIsModalOpen(true)}
                        >
                          Forgot your password?
                        </button>
                      </div>

                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="current-password"
                          className="bg-[#1f2936] text-slate-300 placeholder:text-slate-400 focus:ring-primary focus:border-primary block w-full rounded-md border-gray-300 sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-[primary]/50 hover:text-white"
                >
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm pb-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-400 underline ">
              Create One
            </Link>
          </div>
        </CardContent>
      </Card>
      {/* <ForgetPasswordModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} /> */}
    </div>
  );
}
