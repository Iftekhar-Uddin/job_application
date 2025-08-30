"use server";

import { signIn, signOut } from "./auth";


export const loginWithGoogle = async () => {
  await signIn("google", { redirectTo: "/dashboard" });
};

export const loginWithGithub = async () => {
  await signIn("github", { redirectTo: "/dashboard" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};