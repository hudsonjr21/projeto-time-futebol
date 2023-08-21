import { createContext, ReactNode, useState, useEffect } from 'react';

import { api } from '../services/apiClient';

import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';

import { toast } from 'react-toastify';

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  cellNumber: string;
  role: 'admin' | 'user';
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
  cellNumber: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token');
    Router.push('/');
  } catch {
    console.log('erro ao deslogar');
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | undefined>();
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  async function fetchUserData() {
    try {
      const response = await api.get('/me');
      const userData = response.data;

      setUser(userData);
    } catch (error) {
      // Tratar erros
    }
  }

  useEffect(() => {
    // tentar pegar algo no cookie
    const { '@nextauth.token': token } = parseCookies();

    if (token) {
      fetchUserData();
      api
        .get('/me')
        .then(response => {
          const { id, name, email, cellNumber, role } = response.data;

          setUser({
            id,
            name,
            email,
            cellNumber,
            role,
          });
        })
        .catch(() => {
          // Se deu erro deslogamos o user.
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password,
      });

      const { id, name, token, cellNumber, role } = response.data;

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: '/', // Quais caminhos terão acesso ao cookie
      });

      setUser({
        id,
        name,
        email,
        cellNumber,
        role,
      });

      // Passar para próximas requisições o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      toast.success('Logado com sucesso!');
      fetchUserData();
      // Redirecionar o user para /dashboard
      Router.push('/dashboard');
    } catch (err) {
      toast.error('Erro ao acessar!');
      console.log('ERRO AO ACESSAR ', err);
    }
  }

  async function signUp({ name, email, password, cellNumber }: SignUpProps) {
    try {
      const response = await api.post('/users', {
        name,
        email,
        password,
        cellNumber,
      });

      toast.success('Conta criada com sucesso!');

      Router.push('/');
    } catch (err) {
      toast.error('Erro ao cadastrar!');
      console.log('erro ao cadastrar ', err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}