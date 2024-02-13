import { FormEvent, useState, useEffect } from "react"
import { Input } from "../../../components/input"
import { doc, setDoc, getDoc} from "firebase/firestore"
import { auth, db } from "../../../services/firebaseConnection"
import { User, onAuthStateChanged } from "firebase/auth"
import { Header } from "../../../components/header"

export function Networks() {

    const [instagram, setInstagram] = useState("")
    const [facebook, setFacebook] = useState("")
    const [youtube, setYoutube] = useState("")
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        });

        return () => {
            unsub()
        }
    }, [auth])

    useEffect(() => {
        if (currentUser) {
            const networksRef = doc(db, 'networks', currentUser.uid);
    
            getDoc(networksRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    if (data !== undefined) {
                        setInstagram(data.instagram)
                        setFacebook(data.facebook)
                        setYoutube(data.youtube)
                    }
                }
            })
            .catch((error) => {
                console.error("Erro ao obter os dados do documento:", error);
            })
                
        }
    }, [currentUser]);

    function handleRegister(e: FormEvent) {
        e.preventDefault()

        if (!currentUser) {
            return;
        }

        const networksRef = doc(db, "networks", currentUser.uid);

        setDoc(networksRef, {
            uid: currentUser.uid,
            instagram: instagram,
            facebook: facebook,
            youtube: youtube
        })
        .then(() => {
            alert("Link(s) cadastrado(s) com sucesso!")
            console.log(youtube)
        }).catch((error) => {
            alert("Erro ao salvar no banco de dados." + error)
        })
    }

    return (
        <div className='flex items-center flex-col'> 
        <Header/>
        <form className="flex flex-col mt-8 mb-3 w-11/12 max-w-xl" onSubmit={handleRegister}>

            <h1 className="text-center text-white font-bold text-3xl mb-5">Redes Sociais:</h1>

            <label className="text-white font-medium mt-2 mb-2 text-center">Instagram</label>
            <Input
            type="url"
            placeholder="Digite a URL"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            />

            <label className="text-white font-medium mt-2 mb-2 text-center">Facebook</label>
            <Input
            type="url"
            placeholder="Digite a URL"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            />

            <label className="text-white font-medium mt-2 mb-2 text-center">Youtube</label>
            <Input
            type="url"
            placeholder="Digite a URL"   
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            />

            <button 
            type="submit"
            className="h-8 bg-yellow-500 rounded-lg border-0 text-lg font-medium text-white shadow-xl mt-4 mb-5 hover:scale-110 duration-500">
                Salvar
            </button>

        </form>

        </div>
    )
}