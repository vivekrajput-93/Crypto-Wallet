import { Coins } from "lucide-react"
import { ModeToggle } from "./ModeToggle"


export const Navbar = () => {
    return (
        <div className="flex justify-between border px-4 m-5 rounded-lg py-5">
            <div className="logo_container flex gap-2">
                <Coins size="32" className="text-green-500" />
                <div className="main_title text-3xl font-bold text-green-500">Mudra</div>
            </div> 
            <div className="mode_container">
                <ModeToggle />
            </div>
        </div>
    )
}