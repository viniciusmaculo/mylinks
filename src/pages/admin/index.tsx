import { FormEvent, useEffect, useState } from 'react'
import { Input } from '../../components/input'
import { FiTrash } from 'react-icons/fi'
import { auth, db } from '../../services/firebaseConnection'
import { addDoc, collection, onSnapshot, query, orderBy, doc, deleteDoc, where, getDoc} from 'firebase/firestore'
import { User, onAuthStateChanged } from 'firebase/auth'
import { Header } from '../../components/header'
import { Link } from 'react-router-dom'

interface LinkProps {
    id: string;
    name: string;
    URL: string;
    background: string;
    color: string;
}

export function Admin() {
    const [nameInput, setNameInput] = useState("");
    const [urlInput, setUrlInput] = useState("");
    const [ColorInput, setColorInput] = useState("#f1f1f1");
    const [backgroundInput, setBackgroundInput] = useState("#000");
    const [links, setLinks] = useState<LinkProps[]>([]);

    const [currentUser, setCurrentUser] = useState<User | null>(null)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        });

        return () => {
            unsub()
        }
    }, [])

    useEffect(() => {
        console.log(links)
        if (currentUser) {
            const linksRef = collection(db, 'links');
            const queryRef = query(linksRef, where("uid", "==", currentUser.uid), orderBy("created", "asc"))

            const unsub = onSnapshot(queryRef, (snapshot) => {
                const list = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                } as LinkProps))

                setLinks(list)
            })

            console.log(currentUser)

            return unsub; // Desinscrever do ouvinte quando o componente for desmontado
        }
    }, [currentUser]);

    const handleRegister = (e: FormEvent) => {
        e.preventDefault()

        if (!currentUser) {
            // Usuário não autenticado
            return;
        }

        if (nameInput === '' || urlInput === '') {
            alert("Preencha todos os campos!")
            return;
        }

        addDoc(collection(db, 'links'), {
            uid: currentUser.uid,
            created: new Date(),
            name: nameInput,
            URL: urlInput,
            color: ColorInput,
            background: backgroundInput
        }).then(() => {
            setNameInput("")
            setUrlInput("")
            alert("Cadastrado com sucesso!")

            // Atualiza a lista de links após o cadastro bem-sucedido
            updateLinkList()
        }).catch((error) => {
            alert("Erro ao salvar no banco de dados." + error)
        })
    }

    const updateLinkList = () => {
        const updatedQueryRef = query(collection(db, 'links'), where("uid", "==", currentUser ? currentUser.uid : null), orderBy("created", "asc"))

        onSnapshot(updatedQueryRef, (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as LinkProps))

            setLinks(list)
        })
    }

    const handleDelete = async (id: string) => {
        if (!currentUser) {
            console.error("Usuário não autenticado.");
            return;
        }

        const docRef = doc(collection(db, 'links'), id);

        try {
            const linkDoc = await getDoc(docRef);

            if (linkDoc.exists() && linkDoc.data()?.uid === currentUser.uid) {
                await deleteDoc(docRef);
                console.log("Link excluído com sucesso.")
            } else {
                console.log("O usuário não tem permissão para excluir este link ou o link não existe.");
            }
        } catch (error) {
            console.error("Erro ao tentar excluir o link:", error)
        }
    }


    return (
        <div className='flex items-center flex-col'>
            <Header/>
            <form className="flex flex-col mt-8 mb-3 w-11/12 max-w-xl border-gray-100/25 border rounded-md p-3" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2 text-center">Nome</label>
                <Input
                placeholder="Digite o nome do link"
                value={nameInput}
                onChange={ (e) => setNameInput(e.target.value) }
                />

                <label className="text-white font-medium mt-2 mb-2 text-center">URL</label>
                <Input
                type="url"
                placeholder="Digite a URL"
                value={urlInput}
                onChange={ (e) => setUrlInput(e.target.value) }
                />

                <section className="flex my-4 gap-10 justify-center">
                    <div className="flex flex-col items-center">
                        <label className="text-white font-medium mt-2 mb-2">Cor do link</label>
                        <input
                        type="color"
                        value={ColorInput}
                        onChange={ (e) => setColorInput(e.target.value) }
                        className='rounded-md'
                        />
                    </div>

                    <div className="flex flex-col items-center">
                        <label className="text-white font-medium mt-2 mb-2">Fundo do link</label>
                        <input
                        type="color"
                        value={backgroundInput}
                        onChange={ (e) => setBackgroundInput(e.target.value) }
                        className='rounded-md'
                        />
                    </div>
                </section>

                {nameInput !== '' && (
                    <div className="flex items-center justify-start flex-col mb-7 p-1">
                    <label className="text-white font-medium mt-2 mb-3">Preview:</label>
                    <article
                        className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3"
                        style={{ marginBottom: 8, marginTop: 8, backgroundColor: backgroundInput }}
                    >
                        <p className="font-medium" style={{ color: ColorInput }}>{nameInput}</p>
                    </article>
                    </div>
                )}

                <button 
                type="submit"
                className="h-8 bg-yellow-500 rounded-lg border-0 text-lg font-medium text-white shadow-xl mb-5 hover:scale-110 duration-500">
                    Cadastrar
                </button>

            </form>

            {links.length > 0 && (
                <div className='flex flex-col items-center max-w-xl w-11/12 border-gray-100/25 border rounded-md p-3'>
                    <h3 className='mb-3 font-bold text-white text-2xl'>Links Cadastrados</h3>
                    
                    {links.map((items: LinkProps) => {
                        return (
                            <article
                                key={items.id}
                                className='w-max-11/12 flex w-11/12 rounded-lg px-5 py-1 justify-between text-white font-medium'
                                style={{ margin: 8, backgroundColor: items.background }}
                            >
                                <p className="font-medium" style={{ color: items.color }}>{items.name}</p>
                                <button onClick={() => handleDelete(items.id)}><FiTrash size={25} color='#FFF'/></button>
                            </article>
                        );
                    })}
                </div>
            )}

            {currentUser && currentUser.displayName && (
                <div className='mt-5'>
                    <h3 className='font-bold text-white text-2xl mb-5'>Esse é o seu link único:</h3>
                    <Link to={`http://localhost:5173/${currentUser.displayName}`} className='text-yellow-500 font-bold underline border-gray-100/25 border rounded-md p-3'>http://localhost:5173/{currentUser.displayName}</Link>
                </div>
             )}
        </div>
    )
}