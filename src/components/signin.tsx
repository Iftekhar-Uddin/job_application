"use client"
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";

const loginFormSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email format" }),

    password: z
        .string()
        .min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

const Signin = () => {
    const {register, handleSubmit, formState: { errors }} = useForm<LoginFormData>({resolver: zodResolver(loginFormSchema)});
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: LoginFormData) => {
        // await login(data as unknown as FormData);
        // const formData = new FormData();
        // formData.append("email", data.email);
        // formData.append("password", data.password);
        // await login(formData);
        const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });
        if(result?.error){
            setError("Wrong credentials, please try again!");
            return;
        }
    };

    return (
        <div className="grid grid-rows-1 mb-3 md:mb-0 gap-2 max-h-fit md:w-96 bg-white md:rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <div className="flex flex-col gap-1.5 md:gap-2">
                    <label className="text-sm md:text-base font-medium text-gray-700">
                        Email address
                    </label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border text-sm md:text-base border-gray-300 rounded-lg focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-cyan-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5 md:gap-2">
                    <label className="text-sm md:text-base font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border text-sm md:text-base border-gray-300 rounded-lg focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-cyan-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <button type="submit" className="rounded-md w-full mt-1.5 md:mt-3 py-2 md:py-2.5 md:text-lg bg-black text-white cursor-pointer">Sign In</button>
                {error && <p className="text-red-500 text-sm mx-auto justify-center">{error}</p>}

            </form>
            <div className="flex min-w-full justify-center">
                <p className="w-full text-xs md:text-sm text-end text-gray-600">
                    Don't have an account?&nbsp;
                    <a href="/auth/register" className="text-blue-600 hover:text-indigo-500">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    )
}
export default Signin

// const [state, loginction] = useActionState(login, undefined);