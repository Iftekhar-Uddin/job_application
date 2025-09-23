import { prisma } from "@/lib/prisma";
import {v4 as uuidv4} from "uuid"
import { getVerificationTokenByEmail } from "./verification-token";
// import { verification } from "@/app/api/user/route";


export const generateVerificationToken = async (email: string) => {

    const token = uuidv4();

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);


    if(existingToken){
        await prisma.verificationToken.delete({
            where: {
                identifier: existingToken.identifier
            }
        });
    };

    const VerificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    });


    return VerificationToken

};