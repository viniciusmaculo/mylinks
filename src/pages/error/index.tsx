import { Link } from "react-router-dom";

export function Error() {
    return (
        <div className="w-full min-h-screen flex justify-center items-center flex-col">
            <h1 className="text-white font-bold text-2xl">404</h1>
            <h1 className="text-white font-bold text-4xl">Página não encontrada :/</h1>
            <Link to='/' className="text-white font-medium mt-5 text-xl hover:text-blue-500 hover:scale-105 duration-700 underline">Voltar para a Home</Link>
        </div>
    )
}