"use client";

import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
    name: z.string().nonempty("Username is required").min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    email: z.string().nonempty("Email is required").min(1, "Email is required").max(50, "Email must be less than 50 characters").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


const SignUp = () => {
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const rawdata = FormSchema.parse(data);
        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(rawdata)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create user");
            }

            const result = await response.json();
            alert(result.message);
            window.location.href = "/auth/signin";
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <div className="grid grid-rows-1 gap-4 max-h-fit w-auto bg-white p-8 rounded-xl ">
                <div className="flex flex-col items-center space-y-2">
                    <h1 className="text-cyan-700 font-bold text-4xl">Register</h1>
                    <p className="text-gray-500">Create an account and explore your opportunities</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                    <input {...form.register("name")} placeholder="Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    {form.formState.errors.name && <span className="text-red-500">{form.formState.errors.name.message}</span>}

                    <input {...form.register("email")} type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    {form.formState.errors.email && <span className="text-red-500">{form.formState.errors.email.message}</span>}

                    <input {...form.register("password")} type="password" placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    {form.formState.errors.password && <span className="text-red-500">{form.formState.errors.password.message}</span>}

                    <input {...form.register("confirmPassword")} type="password" placeholder="Confirm Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    {form.formState.errors.confirmPassword && <span className="text-red-500">{form.formState.errors.confirmPassword.message}</span>}

                    <button type="submit" className="rounded-md w-full mt-4 py-2 bg-black text-white cursor-pointer">Sign Up</button>
                </form>
                <div className="flex min-w-full justify-center">
                    <p className="w-72 text-sm text-center">
                        Already have an account?&nbsp;
                        <Link href="/auth/signin" className="text-blue-600 hover:text-indigo-500">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default SignUp;



