import { createContext, useState } from "react";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
const UserContextProvider = ({ children }) => { 
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState("")
    const [profile, setProfile] = useState(null)

    const [trendingMovies, setTrendingMovies] = useState([])
    const [trendingSeries, setTrendingSeries] = useState([])

    const [localSave, setLocalSave] = useState(null)
    const [cloudSave, setCloudSave] = useState(null)

    const [userInfo, setUserInfo] = useState(null)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState("register")


        const toggleDialog = (mode) =>{
            if (mode) setDialogMode(mode)
            setDialogOpen(prevState => !prevState)
        }

    return (
        <UserContext.Provider value={{toggleDialog, dialogOpen, setDialogOpen, dialogMode, setDialogMode, cloudSave, setCloudSave, localSave, setLocalSave, profile, setProfile, userInfo, setUserInfo, isLoggedIn, setIsLoggedIn, username, setUsername, trendingMovies, setTrendingMovies, trendingSeries, setTrendingSeries}}>
            {children} 
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };
