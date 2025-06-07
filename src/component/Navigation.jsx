import { useContext, useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { UserContext } from "../helper/UserContext"
import SearchBar from "./SearchBar"
import AvatarLink from "./AvatarLink"

// eslint-disable-next-line react/prop-types
const Navigation = ({showSearch = true}) => {
    const [isOpen, setIsOpen] = useState(false)
    const {username, isLoggedIn, setUsername, setIsLoggedIn, profile} = useContext(UserContext)
    const [scrolled, setScrolled] = useState(false)
    const {toggleDialog} = useContext(UserContext)

    const toggleOpen = () =>{
        setIsOpen(currentOpen => !currentOpen)
    }

    const logout = () => {
        setUsername("")
        setIsLoggedIn(false)
        localStorage.removeItem("streamhaven-token")
        window.location.reload()
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [])

  return (
    <div className="fixed top-0 left-0 w-full z-[100]">
        
        {/* overlay */}
        <div onClick={toggleOpen} className={`transition-opacity duration-200 ${isOpen ? "display-block" : "display-none"} fixed w-full h-full left-0 top-0 bg-[#242428]/50 backdrop-blur-sm z-20`}></div>

        {/* side bar */}
        <div className={`transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full"} fixed w-[15rem] sm:w-[22rem] h-full left-0 top-0 bg-gray-400/15 backdrop-blur-xl z-30`}>


            {isLoggedIn ? (
                <div>

                    <div className="flex items-end justify-between mx-4 mt-4">
                        <div className="flex items-end gap-2">
                            <AvatarLink profile={profile} />
                            <div className="text-[.8rem] leading-[.9rem]">
                                <p>Welcome Back!</p>
                                <p className="truncate max-w-[8rem] font-bold color-white">{username ? username : "ERROR!!!"}</p>
                            </div>

                        </div>

                        <svg onClick={logout} className="p-2 size-10 cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 16.9998L21 11.9998M21 11.9998L16 6.99982M21 11.9998H9M12 16.9998C12 17.2954 12 17.4432 11.989 17.5712C11.8748 18.9018 10.8949 19.9967 9.58503 20.2571C9.45903 20.2821 9.31202 20.2985 9.01835 20.3311L7.99694 20.4446C6.46248 20.6151 5.69521 20.7003 5.08566 20.5053C4.27293 20.2452 3.60942 19.6513 3.26118 18.8723C3 18.288 3 17.5161 3 15.9721V8.02751C3 6.48358 3 5.71162 3.26118 5.12734C3.60942 4.3483 4.27293 3.75442 5.08566 3.49435C5.69521 3.29929 6.46246 3.38454 7.99694 3.55503L9.01835 3.66852C9.31212 3.70117 9.45901 3.71749 9.58503 3.74254C10.8949 4.00297 11.8748 5.09786 11.989 6.42843C12 6.55645 12 6.70424 12 6.99982" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    </div>

                    <Link to="/save" className="mx-4 mt-4 cursor-pointer border-2 border-gray-400 px-4 py-1.5 rounded-[5px] text-center  grid place-items-center">Saved</Link>
                    <Link to="/history" className="mx-4 mt-4 cursor-pointer border-2 border-gray-400 px-4 py-1.5 rounded-[5px] text-center  grid place-items-center">History</Link>

                </div>
            ):(
                <div>
                    <div className="flex gap-2 mx-4 mt-4">
                        <div onClick={() => toggleDialog("login")} className="cursor-pointer border-2 border-gray-400 px-4 py-1.5 rounded-[5px] w-full text-center  grid place-items-center">Login</div>
                        <div onClick={() => toggleDialog('register')} className="cursor-pointer bg-primary-color-and-hover px-4 py-1.5 rounded-[5px] w-full text-center grid place-items-center">Register</div>
                    </div>
                    <div className="flex flex-col  gap-2 mx-4 mt-4">

                    <div onClick={() => toggleDialog("verify")} className="cursor-pointer border-2 border-gray-400 px-4 py-1.5 rounded-[5px] w-full text-center  grid place-items-center">Verify</div>
                    <div onClick={() => toggleDialog('forget')} className="cursor-pointer border-2 border-gray-400 px-4 py-1.5 rounded-[5px] w-full text-center  grid place-items-center">Forget Password</div>
                    <Link to="/save" className="cursor-pointer border-2 border-gray-400 px-4 py-1.5 rounded-[5px] w-full text-center  grid place-items-center">Saved</Link>
                    <Link to="/history" className="cursor-pointer border-2 border-gray-400 px-4 py-1.5 rounded-[5px] w-full text-center  grid place-items-center">History</Link>

                    </div>
                </div>
            )}
            

            <div className="h-[1px] bg-gray-400 mx-4 mt-[1rem]"></div>

            <h5 className="mx-4 mt-[1rem] text-xl">Types</h5>
            <ul className="mt-[.5rem] text-sm">
                <NavLink to="/" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>All</NavLink>
                <NavLink to="/movie" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Movie</NavLink>
                <NavLink to="/serie" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Series</NavLink>
                {/* <NavLink to="/anime" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Anime</NavLink> */}
                <NavLink to="/filter" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Filter</NavLink>
            </ul>

            <h5 className="mx-4 mt-[2rem] text-xl">Support</h5>
            <ul className="mt-[.5rem] text-sm">
                <NavLink to="/home" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Home</NavLink>
                <NavLink to="/privacy" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Privacy & Policy</NavLink>
                <NavLink to="/term" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Terms Of Service</NavLink>
                {/* <NavLink to="/home" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Values</NavLink>
                <NavLink to="/home" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Supporters</NavLink> */}
                {/* <NavLink to="/home/#about" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>About</NavLink>
                <NavLink to="/home/#values" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Values</NavLink>
                <NavLink to="/home/#supporters" className={({ isActive }) => `${isActive ? "bg-primary-color border-b-blue-600" : "border-b-gray-400"} px-8 border-b mb-[1rem] block p-2 hover:bg-primary-color hover:border-b-blue-600`}>Supporters</NavLink> */}
            </ul>

        </div>
        
        {/* desktop nav */}
        <nav className={`pb-2 flex items-center justify-between pt-[1rem] gap-2 nav-desktop px-[.5rem] lg:px-[2rem] xl:px-[4rem] transition-all duration-200 ${scrolled ? "bg-black/50 backdrop-blur-sm" : ""}`}>
            <div className="flex items-center gap-1">
                <svg onClick={toggleOpen} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 p-1.5 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <Link to="/">
                    <img className="max-w-[3rem]" src="/image/SH Short White.png" alt="" />
                </Link>

            </div>

            {
                showSearch  && (

                    <SearchBar />
                )
            }

            <ul className={`flex gap-4 ${!showSearch ? '' : ''}`}>                <NavLink to="/" className={({isActive}) => `${isActive ? "color-primary font-bold" : ""} p-2`}>All</NavLink>
                <NavLink to="/movie" className={({isActive}) => `${isActive ? "color-primary font-bold" : ""} p-2`}>Movie</NavLink>
                <NavLink to="/serie" className={({isActive}) => `${isActive ? "color-primary font-bold" : ""} p-2`}>Series</NavLink>
                {/* <NavLink to="/filter" className={({isActive}) => `${isActive ? "color-primary font-bold" : ""} p-2`}>Filter</NavLink> */}
            </ul>


            {isLoggedIn ? (
                <>
                        <AvatarLink profile={profile} />
                </>

            ):(
                <div className="flex gap-1">
                    <div onClick={() => toggleDialog("register")} className="cursor-pointer bg-primary-color-and-hover px-4 py-1.5 rounded-[5px]">Register</div>
                    <div onClick={() => toggleDialog("login")} className="cursor-pointer border-2 border-gray-400 px-4 py-1.5 rounded-[5px] w-full text-center  grid place-items-center">Login</div>
                </div>
            )}
        </nav>
        
        {/* mobile nav */}
        <nav className={`pb-2 flex items-center justify-between pt-[1rem] gap-4 z-10 nav-mobile px-[.5rem] lg:px-[2rem] xl:px-[4rem] transition-all duration-200 ${scrolled ? "bg-black/60 backdrop-blur-sm" : ""}`}>
            <Link to="/">
                <img className="max-w-[3rem]" src="/image/SH Short White.png" alt="" />
            </Link>
            {showSearch && (
                <SearchBar />
            )}
            <svg onClick={toggleOpen} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-[40px] max-w-[40px] cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

        </nav>

    </div>
  )
}

export default Navigation
