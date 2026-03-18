import { createContext, useContext, useState } from "react";

const GlobalSetlist = createContext();

export const GlobalProvider = ({ children }) => {
    const [globalPlaylist, setGlobalPlaylist] = useState([]);

    return (
        <GlobalSetlist.Provider value={[globalPlaylist, setGlobalPlaylist]}>
            {children}
        </GlobalSetlist.Provider>
    );
};

export const useGlobalSetlist = () => useContext(GlobalSetlist);
