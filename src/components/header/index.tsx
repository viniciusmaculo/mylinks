import { BiLogOut } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { auth } from '../../services/firebaseConnection'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'

export function Header() {

        const [signed, setSigned] = useState(false)
        
        useEffect(() => {
    
            const unsub = onAuthStateChanged(auth, (user) => {
                if(user) {
                    setSigned(true)
                } else {
                    setSigned(false)
                }

                console.log(signed)
            })
    
            return() => {
                unsub()
            }
    
        }, [])
    

    function handleLogout(){
        signOut(auth)
    }

    return (
        <div className="w-full bg-zinc-200 p-4 flex justify-around">

            <nav className="flex gap-5 font-medium">
                <Link to='/' className='hover:scale-110 duration-500'>Home</Link>
                <Link to='/admin' className='hover:scale-110 duration-500'>Links</Link>    
                <Link to='/admin/social' className='hover:scale-110 duration-500'>Redes Sociais</Link>       
            </nav>

            { signed && (
                 <button onClick={handleLogout} className='color-black hover:scale-110 duration-500 flex gap-1 font-bold'><BiLogOut size={25}/>Sair</button>
            )
            }
           

        </div>
    )
}