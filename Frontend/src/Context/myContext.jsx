// myContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [userInfo]);

  const storeUserInfo = (info) => {
    setUserInfo(info);
    localStorage.setItem("userInfo", JSON.stringify(info)); // 🔥 Just to be safe
  };

  return (
    <MyContext.Provider value={{ userInfo, setUserInfo, storeUserInfo }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
