import { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
    return(
        <input
            className="mb-3 px-2 h-7 border-0 rounded-md outline-none shadow-md"
            {...props}
        />
    )
}