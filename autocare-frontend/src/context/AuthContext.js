import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {

      const parsedUser = JSON.parse(savedUser);

      // Restore JWT for Axios after page refresh
      if (parsedUser.token) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${parsedUser.token}`;
      }

      return parsedUser;
    }

    return null;
  });


  // ========================================
  // LOGIN
  // ========================================

  const login = (loginResponse) => {

    /*
      Backend returns:

      {
        user: {...},
        token: "..."
      }
    */

    const loggedInUser = {
      ...loginResponse.user,
      token: loginResponse.token
    };

    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    // Set JWT for ALL Axios requests
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${loginResponse.token}`;

    setUser(loggedInUser);
  };


  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {

    localStorage.removeItem("user");

    // Remove JWT from Axios
    delete axios.defaults.headers.common["Authorization"];

    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;