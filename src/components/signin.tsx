"use client"
import { getCsrfToken, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { AuthError } from "next-auth";
import { generateVerificationToken } from '@/data/token';
import { getUserByEmail } from '@/data/route';


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

const Signin = ({ csrfToken }: { csrfToken: string }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginFormSchema) });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isbmitting, setIsbmitting] = useState({});
  // const params = useSearchParams();
  // const errorParam: any = params.get('error');
  console.log(isbmitting)

  const onSubmit = async (data: LoginFormData) => {

    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // if (res?.ok) {
      //     setSuccess("Verification Email sent Successflly")
      // }

      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Invalid email or password." : "Something went wrong!");
      } else {
        toast.success("User login successfully!")
        // window.location.href = '/dashboard'; // or wherever you want
      }

    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(`${error}`);
    } finally {

      window.location.href = '/dashboard'; // or wherever you want

    }

    setIsSubmitting(false);
  };


  return (
    <div className="grid grid-rows-1 mb-3 md:mb-0 gap-2 max-h-fit md:w-96 bg-white md:rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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
        <button disabled={false} type="submit" className="rounded-md w-full mt-1.5 md:mt-3 py-2 md:py-2.5 md:text-lg bg-black text-white cursor-pointer">{isSubmitting ? 'Signing In...' : 'Sign In'}</button>
        {error && <p className="text-red-500 text-sm mx-auto justify-center">{error}</p>}
        {success && <p className="text-emerald-600 text-sm mx-auto justify-center">{success}</p>}

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
export default Signin;


export const getServerSideProps: GetServerSideProps = async () => {
  const csrfToken = await getCsrfToken();
  return {
    props: {
      csrfToken,
    },
  };
};















// const email = data.email
// const existingUser = await getUserByEmail(email);
// setIsbmitting(existingUser as any)

// // toast.success(existingUser.message);

// if (!existingUser || !existingUser.email || !existingUser.password) {
//     setError("Email does not exist!")
// }

// if (!existingUser?.emailVerified) {
//     const tokenSuccess = await generateVerificationToken(email as string);
//     setSuccess("Confirmation email sent!");
//     return {success: "Confirmation email sent!"}
// }




// await login(data as unknown as FormData);
// const formData = new FormData();
// formData.append("email", data.email);
// formData.append("password", data.password);
// await login(formData);






// const [state, loginction] = useActionState(login, undefined);


// } catch (error) {
//     if(error instanceof AuthError){
//         switch (error.type) {
//             case "CredentialsSignin":
//                 return {error: "Invalid credentials!"}
//             default:
//                 return {error: "Something went wrong"}
//         }
//     }
//     throw error
// }

// return


// const errorMessages: Record<string, string> = {
//     InvalidCredentials: 'Invalid email or password.',
//     CredentialsSignin: 'Invalid email or password.',
//     default: 'Something went wrong. Try again.',
// };




// import { getCsrfToken, signIn } from 'next-auth/react';
// import { GetServerSideProps } from 'next';
// import { useState } from 'react';
// import { z } from 'zod';
// import Head from 'next/head';

// const signInSchema = z.object({
//     email: z.string().email({ message: 'Invalid email address' }),
//     password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
// });

// type SignInFormData = z.infer<typeof signInSchema>;

// export default function SignIn({ csrfToken }: { csrfToken: string }) {
//     const [formData, setFormData] = useState<SignInFormData>({ email: '', password: '' });
//     const [errors, setErrors] = useState<Partial<SignInFormData>>({});
//     const [formError, setFormError] = useState<string | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//         setErrors({});
//         setFormError(null);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const result = signInSchema.safeParse(formData);

//         if (!result.success) {
//             const fieldErrors: Partial<SignInFormData> = {};
//             result.error.errors.forEach((err) => {
//                 if (err.path[0]) fieldErrors[err.path[0] as keyof SignInFormData] = err.message;
//             });
//             setErrors(fieldErrors);
//             return;
//         }

//         setIsSubmitting(true);
//         const res = await signIn('credentials', {
//             redirect: false,
//             email: formData.email,
//             password: formData.password,
//         });

//         setIsSubmitting(false);

//         if (res?.error) {
//             setFormError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
//         } else {
//             window.location.href = '/dashboard'; // or wherever you want
//         }
//     };

//     return (
//         <>
//             <Head>
//                 <title>Sign In</title>
//             </Head>
//             <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                 <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
//                     <h1 className="text-2xl font-semibold text-center">Sign In</h1>

//                     <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Email</label>
//                         <input
//                             name="email"
//                             type="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-blue-200`}
//                             placeholder="you@example.com"
//                         />
//                         {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Password</label>
//                         <input
//                             name="password"
//                             type="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className={`mt-1 block w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-blue-200`}
//                             placeholder="********"
//                         />
//                         {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
//                     </div>

//                     {formError && <p className="text-red-600 text-sm text-center">{formError}</p>}

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
//                         disabled={isSubmitting}
//                     >
//                         {isSubmitting ? 'Signing in...' : 'Sign In'}
//                     </button>

//                     <p className="text-sm text-gray-600 text-center">
//                         Don't have an account? <a href="/register" className="text-blue-500 underline">Register</a>
//                     </p>
//                 </form>
//             </div>
//         </>
//     );
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const csrfToken = await getCsrfToken(context);
//     return {
//         props: {
//             csrfToken,
//         },
//     };
// };
