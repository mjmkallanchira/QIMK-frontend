import { createContext, useEffect, useState } from "react";

import { server } from "../Constants/Constant";

export const UserContext = createContext();

export const Authprovider = ({ children }) => {
    const [token, settoken] = useState(localStorage.getItem("token"));
    const [user, setuser] = useState();
    const [ispageloading, setispageloading] = useState(false);
    const [userloading, setuserloading] = useState(true);
    const storetokeninlokalstorage = (token) => {
        settoken(token);
        return localStorage.setItem("token", token);
    };
    const Logoutuser = () => {
        settoken("");

        return localStorage.removeItem("token");
    };

    let isloggedin = !!token;
    const jwtauthentication = async () => {
        try {
            setuserloading(true);
            const response = await fetch(`${server}/userdata`, {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            // console.log(response);
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                setuser(data.userdetails);
                setuserloading(false);
                // console.log();
            }
        } catch (error) {
            setuserloading(false);
            console.log(error);
        }
    };
    useEffect(() => {
        jwtauthentication();
    }, []);

    return (
        <UserContext.Provider
            value={{
                ispageloading,
                setispageloading,
                userloading,
                storetokeninlokalstorage,
                Logoutuser,
                isloggedin,
                jwtauthentication,
                user,
                token,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
