import { Link } from "react-router-dom"
import { useTypewriter, Cursor } from "react-simple-typewriter"
import { Footer } from "../../components/footer"

export function Home() {

    const [text] = useTypewriter({
        words: ["Gerencie", "Organize", "Compartilhe"],
        loop: true,
    })

    return (
        <div className="flex justify-center items-center flex-col w-full h-screen ">

        <h1 className="text-white font-bold size text-lg sm:text-3xl lg:text-4xl"><span className="text-yellow-500">{text}<Cursor/></span> seus links de um único lugar. </h1>

        <Link to='/registro'><h2 className="mt-8 text-white hover:bg-yellow-500 hover:scale-110 duration-500 font-bold m-7 border border-yellow-500 py-3.5 px-6 rounded-3xl cursor-pointer">Começar</h2></Link>

        <Footer/>
        </div>
    )
}