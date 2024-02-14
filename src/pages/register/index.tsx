import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, onAuthStateChanged, updateProfile } from "firebase/auth";
import {collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConnection";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "../../components/input";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  useEffect( () => {
    const unsub = onAuthStateChanged(auth, (user) => {
      user && navigate("/admin", { replace: true })
    })

    return() => {
      unsub()
    }

  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (email === "" || password === "" || confirmPassword === "" || username === "") {
      alert("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {

    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        alert("E-mail já cadastrado!");
        return;
      }

    // Consulta para verificar se o nome de usuário já está cadastrado
    const usernameQuerySnapshot = await getDocs(query(collection(db, "uidUsernameAssociations"), where("username", "==", username)));
    if (!usernameQuerySnapshot.empty) {
      alert("Nome de usuário já cadastrado.");
      return;
    }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Atualiza o perfil do usuário com o nome de usuário
      await updateProfile(userCredential.user, { displayName: username });

      // Adiciona uma entrada à coleção associativa
      const uid = userCredential.user.uid;
      const associationRef = doc(db, "uidUsernameAssociations", uid);
      await setDoc(associationRef, {
        username: username,
      });

      console.log("Usuário cadastrado com sucesso!");
      navigate("/admin", { replace: true });
    } catch (error) {
      console.log("Ocorreu um erro." + error);
    }
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
          placeholder="Digite seu nome de usuário (sem espaços)"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Digite seu e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Digite sua senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="Confirme sua senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-8 bg-blue-500 rounded-lg border-0 text-lg font-medium text-white shadow-xl"
        >
          Cadastrar
        </button>
      </form>

      <h3 className="text-white font-bold mt-3">
        Já possui uma conta? <Link to="/login" className="cursor: pointer underline hover:text-blue-500 duration-200">Faça Login</Link>
      </h3>
    </div>
  );
}