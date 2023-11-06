import { FC, createContext } from "react";
import { AuthProviderProps } from "../../types";

export type AuthContextType = string | null;
export const AuthContext = createContext<AuthContextType>(null);

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  return (
    <AuthContext.Provider value={authToken}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
