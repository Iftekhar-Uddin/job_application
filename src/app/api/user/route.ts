"use server";

import { prisma } from "@/lib/prisma";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { cookies } from "next/headers";
import bcrypt from 'bcryptjs';
// import { signIn } from "../../../../auth";
import { redirect} from "next/navigation";




const userSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    email: z.string().min(1, "Email is required").max(50, "Email must be less than 50 characters").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {  
    message: "Passwords do not match",

});


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, confirmPassword } = userSchema.parse(body);

        const existingEmail = await prisma.user.findUnique({ where: { email: email }});
        if (existingEmail) {
            return NextResponse.json({ user: null, message: "User already exists with this email" }, { status: 409 });
        };


        if(password !== confirmPassword) {
            return NextResponse.json({ user: null, message: "Passwords do not match" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        if (!newUser) {
            return NextResponse.json({ user: null, message: "Failed to create user" }, { status: 500 });
        }

        return NextResponse.json({ user: newUser, message: "User created successfully" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ user: null, message: "Internal server error" }, { status: 500 });
    }
    
};


const secretkey = process.env.JWT_SECRET;
const sessionKey = new TextEncoder().encode(secretkey);

export async function createSession(user: { id: string; name: string; email: string; }) {
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
    const session = await encrypt({user, expires});
    (await cookies()).set("session", session, { expires, httpOnly: true, secure: true, sameSite: "strict" });
    return session;
}


type SessionPayload = {
    user: {
        id: string;
        name: string;
        email: string;
    };
    expires: Date;
}


export async function encrypt(payload: SessionPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(sessionKey);
};

export async function decrypt(session: string): Promise<any> {
    const { payload } = await jwtVerify(session, sessionKey, {
        algorithms: ["HS256"],
    });
    return payload;
}

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").max(50, "Email must be less than 50 characters").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});


export const login =  async (formData: FormData) => {
    const email = formData.get("email");
    const password =  formData.get("password");

    if (!email || !password) {
        return { error: "Email and password are required" };
    };

    const userData = loginSchema.safeParse({ email, password });

    if (!userData.success) {
        const errors = userData.error.flatten().fieldErrors;
        return { error: errors.email?.[0] || errors.password?.[0] || "Invalid input" };
    }

    const { email: validEmail, password: validPassword } = userData.data;

    try {

        const user = await prisma.user.findUnique({ where: { email: validEmail } });
        if (!user) {
            return { error: "User not found" };
        };

        const isValidPassword = await bcrypt.compare(validPassword, user.password || "");
        if (!isValidPassword) {
            return { error: "Invalid credentials" };
        }

        try {
            // await signIn("credentials", { redirect: false, email: validEmail, password: validPassword });
            // const successfull = await createSession({ id: user.id, name: user.name || "", email: user.email || "" }); // Replace with actual user data

        } catch (error: any) {
            if(error.message.includes("CredentialsSignin")){
                return { error: "Invalid credentials" };
            }
            throw error;
        }

    } catch (error) {
        console.log(error);
        return { error: "Failed to login" };
    }

    redirect("/");
};

export async function logout1(){
    (await cookies()).set("session", "", { expires: new Date(0), httpOnly: true, secure: true, sameSite: "strict" });
};

export async function getSession(){
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if(!session) return null;

    try {
        const data = await decrypt(session);

        if(new Date(data.expires) > new Date()){
            return data;
        }
        
        if(new Date(data.expires) < new Date()){
            return await updateSession(Request as unknown as NextRequest);
        }

        logout1();
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function updateSession(request: NextRequest){
    const session = request.cookies.get("session")?.value || (await cookies()).get("session")?.value;
    if(!session) return null;

    try {
        const data = await decrypt(session);
        if(new Date(data.expires) > new Date()){
            const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
            const newSession = await encrypt({user: data.user, expires});
            const response = NextResponse.next();
            response.cookies.set("session", newSession, { expires, httpOnly: true, secure: true, sameSite: "strict" });
            return response;
        }
        logout1();
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}





// await createSession({ id: actualData.id, name: actualData.name, email:actualData.email }); // Replace with actual user data
// return { success: true }
// if (!email || !password) {
//     return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
// };
// const validPassword = await bcrypt.compare(password, (await prisma.user.findUnique({ where: { email: email } }))?.password || "");
// if (!validPassword) {
//     return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
// }
// const user = await prisma.user.findUnique({ where: { email: email } })
// if (!user) {
//     return NextResponse.json({ message: "User not found" }, { status: 404 });
// }
// const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
// const session = await encrypt({user, expires})
// (await cookies()).set("session", session, { expires, httpOnly: true, secure: true, sameSite: "strict" });
// return NextResponse.json({ user }, { status: 200 });