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
  const [numberGame, setNumberGame] = useState('');
  const router = useRouter();

  async function handleRegister(event: FormEvent){
    event.preventDefault();

    try {
      if (day === '' || numberGame === '') {
        toast.error("Preencha todos os campos!");
        return;
      }
  
      const data = {
        numberGame: parseInt(numberGame), // Converter para inteiro
        day,
      };
  
      const apiClient = setupAPIClient();
  
      await apiClient.post('/game', data);
  
      // Redireciona para a próxima página
      router.push(`/addGame?numberGame=${numberGame}&day=${day}`);
      setDay('');
      setNumberGame('');

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error); // Exibe a mensagem de erro do backend
      } else {
        toast.error("Ops, erro ao cadastrar!");
      }
    }
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
              type="number"
              placeholder="N° do Jogo"
              className={styles.input}
              value={numberGame}
              onChange={(e) => setNumberGame(e.target.value)}
            />

            <input
              type="date"
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