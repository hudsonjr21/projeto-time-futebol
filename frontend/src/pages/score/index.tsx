import { useState, useEffect} from 'react'
import Head from "next/head"
import {Header} from '../../components/Header'
import styles from './styles.module.scss'
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { useRouter } from 'next/router'  

export default function Score(){
    const router = useRouter();

    const [homeScore, setHomeScore] = useState('')
    const [awayScore, setAwayScore] = useState('');
    const [homeTeam, setHomeTeam] = useState('');
    const [awayTeam, setAwayTeam] = useState('');
    const [id, setId] = useState('');

async function handleAdd() {
    try {
      const apiClient = setupAPIClient();
  
      const data = {
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
        game_id: id,
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

    const homeTeamValue = typeof queryHome === 'string' ? queryHome : '';
    const awayTeamValue = typeof queryAway === 'string' ? queryAway : '';

    setHomeTeam(homeTeamValue);
    setAwayTeam(awayTeamValue);
  }, [router.query]);

  useEffect(() => {
    const id = router.query.game_id;
    setId(id as string);

  }, [router.query.game_id]);

  return(
    <>
    <Head>
      <title>Placar do Jogo - JOGOS ENTRE AMIGOS</title>
    </Head>
    <div>
      <Header/>

      <main className={styles.container}>
        <h1>Placar do Jogo</h1>

        <div className={styles.containerLabel}>
            <h3 className={styles.h3Home}>{homeTeam}</h3> 
            <h3 className={styles.h3Away}>{awayTeam}</h3>
        </div>

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
    return {
      props: {},
    };
  });