"use client"

import { newVerification } from "@/actions/new-verification"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const VerifyEmailForm = () => {
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(()=> {
        if(success || error) {
            return
        }

        if(!token) {
            setError("No token provided")
            return
        }

        newVerification(token).then((data)=> {
            if(data.success){
                setSuccess(data.success)
            }
            if(data.error){
                setError(data.error)
            }
        }).catch((error)=> {
            console.error(error)
            setError("An unexpected error occurred")
        })

    }, [token, success, error]);

    useEffect(()=> {
        onSubmit();
    }, [])


  return (
    <div>
        <h1>Confirming your email address</h1>
        <h2>Confirming now...</h2>
        <Link href="/auth/login">Back to login</Link>
        <div>
            {success && !error && <p>Loading...</p>}
            {/* {token && <p>{token}</p>} */}
        </div>
    </div>
  )
}

export default VerifyEmailForm