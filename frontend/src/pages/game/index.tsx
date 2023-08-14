import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '@/src/utils/canSSRAuth';
import { useRouter } from 'next/router';

type GameDetailProps = {
  id: string;
  name: string;
}

interface TeamProps{
  teamList: GameDetailProps[];
}

export default function Game({ teamList }: TeamProps) {
  
  const [day, setDay] = useState('');
  const [numberGame, setNumberGame] = useState('');
  const [id, setId] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const router = useRouter();

  async function handleRegister(event: FormEvent){
    event.preventDefault();

    try {
      if (day === '' || numberGame === '') {
        toast.error("Preencha todos os campos!");
        return;
      }

      if (homeTeam === awayTeam) {
        toast.warning("Os times selecionados devem ser diferentes!");
        return;
      }
  
      const data = {
        numberGame: parseInt(numberGame), // Converter para inteiro
        day,
        homeTeam,
        awayTeam, 
      };
  
      const apiClient = setupAPIClient();
      const response = await apiClient.post('/game', data);
      const createdGameId = response.data.id;
  
      // Redireciona para a próxima página
      router.push(`/addGame?numberGame=${numberGame}&day=${day}&id=${createdGameId}&homeTeam=${homeTeam}&awayTeam=${awayTeam}`);
      setId('');
      setDay('');
      setNumberGame('');
      setHomeTeam('');
      setAwayTeam('');

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

        <div className={styles.inputGroup}>
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
        </div>

          <div className={styles.selectGroup}>
                <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
                  <option value="">Selecione time da casa...</option>
                  {teamList.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>

                <select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}>
                  <option value="">Selecione time visitante...</option>
                  {teamList.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
          </div>

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
  const apiClient = setupAPIClient(ctx);

  const teamResponse = await apiClient.get('/team');

  return {
    props: {
      teamList: teamResponse.data,
    },
  };
});