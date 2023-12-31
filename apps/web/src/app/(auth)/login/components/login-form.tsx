"use client";

import React from "react";
import { useLogin } from "../../../../../api/auth";
import { Button } from "../../../../components/button/Button";
import { Input } from "../../../../components/input/BaseInput";
import { toast } from "../../../../components/toast/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormType } from "../../../../../schema/login";
import { useRouter } from "next/navigation";
import { privatePath } from "../../../../utils/paths";

export const LoginForm = () => {
  const router = useRouter();

  const { mutate: login, isLoading } = useLogin({
    onSuccess: () => {
      router.push(privatePath.organization);
      toast({
        desc: "Welcome back!",
        title: "Login Successful",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        desc: "Login failed",
        title: error.message || "Something went wrong",
        variant: "error",
      });
    },
  });

  const { register, handleSubmit } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = ({ email, password }: LoginFormType) => {
    login({ email, password });
  };

  return (
    <form
      className="bg-card flex flex-col justify-between gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input required placeholder="email" type="email" {...register("email")} />
      <Input
        required
        placeholder="password"
        type="password"
        {...register("password")}
      />
      <Button type="submit" variant={"primary"} isLoading={isLoading}>
        Login
      </Button>
    </form>
  );
};
