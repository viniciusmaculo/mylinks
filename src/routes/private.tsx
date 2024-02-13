import { ReactNode, useState, useEffect } from 'react'
import { auth } from '../services/firebaseConnection'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom'

interface PrivateProps {
    children: ReactNode
}

export function Private({children}: PrivateProps){

    const [loading, setLoading] = useState(true)
    const [signed, setSigned] = useState(false)
    
    useEffect(() => {

        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                const userData = {
                    id: user?.uid,
                    email: user?.email
                }

                localStorage.setItem("@userData", JSON.stringify(userData))
                setLoading(false)
                setSigned(true)
            } else {
                setLoading(false)
                setSigned(false)
            }
        })

        return() => {
            unsub()
        }

    }, [])

    if(loading) {
        return <div></div>
    }

    if(!signed) {
        return <Navigate to={"/login"}/>
    }

    return children
}