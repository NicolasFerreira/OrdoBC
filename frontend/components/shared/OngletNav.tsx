import React from 'react';
import { useState, useEffect } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import {
    ScrollText,
    Home,
    UsersRound,
    UserRound,
    ContactRound,
    PanelLeft,
    PlusCircle,
    Search,
    Settings,
    ShoppingCart,
    Upload,
    Users2,
    LucideProps
} from "lucide-react"

interface OngletNavProps {
    link: string;
    icons: string;
    textTooltip: string;
}

const OngletNav: React.FC<OngletNavProps> = ({ link, icons, textTooltip }) => {
    const pathname = usePathname()
    // const [classIcon, setClassIcon] = useState("")
    // let classBase = "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 "
    // let classActive = "text-accent-foreground"

    useEffect(() => {
        //setClassIcon(classBase)
    }, [])

    useEffect(() => {
        // if (pathname === link) {
        //     //setClassIcon(`${classBase} ${classActive}`)
        // }
    }, [pathname])

    const getIcon = (icon: string) => {
        switch (icon) {
            case "ScrollText":
                return <ScrollText className="h-5 w-5" />
            case "UsersRound":
                return <UsersRound className="h-5 w-5" />
            case "UserRound":
                return <UserRound className="h-5 w-5" />
            case "ContactRound":
                return <ContactRound className="h-5 w-5" />
            case "PanelLeft":
                return <PanelLeft className="h-5 w-5" />
            case "PlusCircle":
                return <PlusCircle className="h-5 w-5" />
            case "Search":
                return <Search className="h-5 w-5" />
            case "Settings":
                return <Settings className="h-5 w-5" />
            case "ShoppingCart":
                return <ShoppingCart className="h-5 w-5" />
            case "Upload":
                return <Upload className="h-5 w-5" />
            case "":
                return <Home className="h-5 w-5" />
            default:
        }
    }


    return (
        <Link
            href={link}
            className="flex items-center gap-3 rounded-lg text-sm px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
            {getIcon(icons)}
            {textTooltip}
        </Link>
    )
}


export default OngletNav