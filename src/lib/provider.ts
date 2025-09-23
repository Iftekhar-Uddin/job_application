"use server";
import { signIn, signOut } from "@/lib/auth";

export const loginWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const loginWithGithub = async () => {
  await signIn("github", { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};