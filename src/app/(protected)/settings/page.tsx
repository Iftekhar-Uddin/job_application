import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation';

import React from 'react'

const settingsPage = async () => {
    const session = await auth();


    if (!session) {
        redirect("/auth/signin")
    }

    return (
        <div className='md:max-w-7xl max-w-2xl mx-auto rounded-md sm:px-6 lg:px-0 h-[calc(100vh-10rem)]'>
            <p className=''>{session.user.name}</p>
            <p className=''>{session.user.email}</p>
            <p className=''>{session.user.id}</p>
            <p className=''>{session.user.role}</p>
        </div>
    )
}

export default settingsPage