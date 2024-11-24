import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useGlobalContext } from "../context/GlobalProvider";

const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { setBlog } = useGlobalContext();

    const fetchData =  async () => {
        setIsLoading(true);
        try {
            const response = await fn();
            setData(response);
            setBlog(response)
        } catch (error) {
            Alert.alert('Error', error.message)
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        fetchData();
    }, [])

    const refetchData = () => {
        fetchData();
    }

    return { data, isLoading, refetchData}
} 

export default useAppwrite;