import { useState, useEffect} from 'react'
import Head from "next/head"
import {Header} from '../../components/Header'
import styles from './styles.module.scss'
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { useRouter } from 'next/router'

type GameDetailProps = {
    id: string;
    name: string;
  };
  
interface PropsServer {
    teamList: GameDetailProps[];
}
  

export default function Score({ teamList}: PropsServer){
    const router = useRouter();

    const [homeScore, setHomeScore] = useState('')
    const [awayScore, setAwayScore] = useState('');
    const [homeTeam, setHomeTeam] = useState('');
    const [awayTeam, setAwayTeam] = useState('');

async function handleAdd() {
    try {
      const apiClient = setupAPIClient();
  
      const data = {
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
      };
  
      await apiClient.post('/score', data);

      toast.success('Jogo cadastrado com sucesso!');
      setHomeScore('');
      setAwayScore('');

     router.push('/dashboard')

    } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error); // Exibe a mensagem de erro do backend
        } else {
            toast.error("Ops, erro ao finalizar o jogo!");
        }
      }
  }

  useEffect(() => {
    const { query } = router;
    const {
      homeTeam: queryHome,
      awayTeam: queryAway,
    } = query;

    if (queryHome && queryAway) {
        // setNumberGame(queryNumberGame as string);
        // setDay(formatDate(queryDay as string));
        // setId(queryId as string);
  
        // Buscar os nomes dos times a partir dos IDs
        const homeTeamName = teamList.find(team => team.id === queryHome)?.name || '';
        const awayTeamName = teamList.find(team => team.id === queryAway)?.name || '';
        setHomeTeam(homeTeamName);
        setAwayTeam(awayTeamName);
      }
    }, [router.query]);

  return(
    <>
    <Head>
      <title>Placar do Jogo - JOGOS ENTRE AMIGOS</title>
    </Head>
    <div>
      <Header/>

      <main className={styles.container}>
        <h1>Placar do Jogo {homeTeam} {awayTeam}</h1>

        <form className={styles.form}>
        
        <div className={styles.inputGroup}>
        <input 
          type="number" 
          placeholder="0"
          className={styles.input}
          value={homeScore}
          onChange={ (e) => setHomeScore(e.target.value) }
          />
            <strong>X</strong>
          <input 
          type="number" 
          placeholder="0"
          className={styles.input}
          value={awayScore}
          onChange={ (e) => setAwayScore(e.target.value) }
          />
        </div>
          
          <button 
            className={styles.buttonAdd} 
            type="button"
            onClick={handleAdd}>
                Finalizar Jogo
          </button>
        </form>
      </main>
    </div>
    </>
  )
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