import { FormEvent, useEffect, useState } from "react";
import { Input } from "../../components/input";

import { auth } from '../../services/firebaseConnection';
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export function Login() {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const navigate = useNavigate()

    useEffect( () => {
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log(user)
          user && navigate("/admin", { replace: true })
        })
    
        return() => {
          unsub()
        }
    
      }, [])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        
        if (email === '' || password === '') {
            alert("Preencha todos os campos.")
            return
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("Logado com sucesso!")
            navigate("/admin", {replace: true})
        })
        .catch((error) => {
            alert("E-mail ou senha incorreto!")
            console.log(error)
        })

    }

    return (
        <div className="w-full h-screen flex flex-col items-center mt-20">

            <Link to={"/"}>
            <h1 className="mt-11 mb-7 text-white font-bold text-5xl hover:scale-105 duration-500">
            My<p className="inline bg-gradient-to-t from-yellow-500 to-orange-500 bg-clip-text text-transparent">Links</p>
            </h1>
            </Link>
            
            <form onSubmit={handleSubmit} className="w-11/12 max-w-xl flex flex-col px-3">
                <Input
                    placeholder="Digite seu e-mail"
                    type="email"    
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <Input
                    placeholder="Digite sua senha"
                    type="password"    
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button 
                type="submit"
                className="h-8 bg-blue-500 rounded-lg border-0 text-lg font-medium text-white shadow-xl">
                    Fazer Login
                </button>
            </form>

            <h3 className="text-white font-bold mt-3">Ainda não é cadastrado? <Link to='/registro' className="cursor: pointer underline hover:text-blue-500 duration-200">Cadastre-se</Link> </h3>
            
        </div>
    )
}