import { createContext, useContext, useEffect, useState }from "react";
import { getCurrentUser } from "../lib/appwrite";
import { router } from "expo-router";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null);
    const [blog, setBlog ] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(()=>{
        getCurrentUser()
        .then( res => {
            if(res) {
                setUser(res);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        })
        .catch( error => {
            const a = JSON.parse(JSON.stringify(error));
            if(a.code === 401) {
                return
            }
            throw new Error('Error', error);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [])


    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            blog,
            setBlog,
            setUser,
            isLoading,
            setIsLoading
        }}>
        {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;