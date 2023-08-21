import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

export const canAccessAdminRoute = (
  getServerSidePropsFunc: (
    ctx: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<any>>
) => {
  return async (ctx: GetServerSidePropsContext) => {
    const { '@nextauth.token': token } = parseCookies(ctx);

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    try {
      // Decodifica o token
      const decodedToken = jwt.decode(token);

      if (!decodedToken || decodedToken.role !== 'admin') {
        return {
          redirect: {
            destination: '/dashboard', // Redireciona para a página inicial do admin
            permanent: false,
          },
        };
      }
    } catch (error) {
      // Lida com erros de decodificação do token
      console.error('Erro ao decodificar o token:', error);
    }

    return await getServerSidePropsFunc(ctx);
  };
};