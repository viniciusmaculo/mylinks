import { ReactNode } from "react"

interface SocialProps {
    children: ReactNode
    url: string
}

export function Social( {url, children}: SocialProps) {
    return (
        <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
        >
            {children}
        </a>
    )
}