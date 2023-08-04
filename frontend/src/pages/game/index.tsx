import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { useRouter } from 'next/router';

export default function Game() {
  const [day, setDay] = useState('');
  const router = useRouter();


  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    const data = new FormData();

    if (day === '') {
      toast.error('Preencha o dia do Jogo!');
      return;
    }

    data.append('day', day);

    try {
        const apiClient = setupAPIClient();
  
        await apiClient.post('/game', { day: day }); // Envie o dia do jogo diretamente no corpo da requisição
  
        // Redirecione para a próxima página
        // Substitua '/addGame' pelo caminho da página que você quer redirecionar após criar o jogo
        router.push('/addGame');
  
      } catch (error) {
        toast.error('Erro ao criar o jogo');
      }
      setDay('');
    }

  return (
    <>
      <Head>
        <title>Novo Jogo - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Novo Jogo</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Data do jogo **/**/****"
              className={styles.input}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Avançar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    return {
      props: {}
    }
  
  })