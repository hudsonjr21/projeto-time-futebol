import { useState, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

type GameDetailProps = {
  id: string;
  name: string;
};

interface PropsServer {
  teamList: GameDetailProps[];
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export default function addGame({ teamList }: PropsServer) {
  const router = useRouter();

  const [team, setTeam] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [playerListByTeam, setPlayerListByTeam] = useState([]);
  const [score, setScore] = useState('');
  const [player, setPlayer] = useState('');
  const [numberGame, setNumberGame] = useState('');
  const [day, setDay] = useState('');

  async function loadPlayersByTeam(teamId) {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get(`/team/player?team_id=${teamId}`);
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();


    try {
      if (team === '' || selectedPlayers.length === 0) {
        toast.error('Preencha todos os campos!');
        return;
      }

      const data = {
        team_id: team,
        players: selectedPlayers,
        numberGame: parseInt(numberGame),
        day,
      };

      const apiClient = setupAPIClient();
      await apiClient.post('game/add', data);

      toast.success('Jogo adicionado com sucesso!');
      setTeam('');
      setSelectedPlayers([]);
      setNumberGame('');
      setDay('');
    } catch (err) {
      toast.error('Ops erro ao cadastrar!');
    }
  }

  async function handleAddPlayer() {
    if (selectedPlayers.find((p) => p.player === player)) {
      toast.error('Jogador já foi adicionado.');
      return;
    }
  
    if (!player || !score) {
      toast.error('Preencha todos os campos.');
      return;
    }
  
    setSelectedPlayers([
      ...selectedPlayers,
      { player, score: Number(score) }, // Convertendo score para número
    ]);
    setPlayer('');
    setScore('');
  }
  

  useEffect(() => {
    if (team) {
      loadPlayersByTeam(team)
      .then((players) => {
        setPlayerListByTeam(players);
      });
    }
  }, [team]);

  useEffect(() => {
    const { query } = router;
    const { numberGame: queryNumberGame, day: queryDay } = query;

    if (queryNumberGame && queryDay) {
      setNumberGame(queryNumberGame as string);
      setDay(formatDate(queryDay as string)); //Formatando a data aqui
    }

  }, [router.query]);

  return (
    <>
      <Head>
        <title>Detalhes Jogo - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>

          <h1>Detalhes do Jogo - N° {numberGame} - {day}</h1>

          <form className={styles.form} onSubmit={handleRegister}>

            <select
              value={team}
              onChange={(e) => {
                setTeam(e.target.value);
              }}
            >
              <option value="">Selecione um time...</option>
              {teamList.map((team) => {
                return (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                );
              })}
            </select>

            <select value={player} onChange={(e) => setPlayer(e.target.value)}>
              <option value="">Selecione um jogador...</option>
              {playerListByTeam.map((player) => {
                return (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                );
              })}
            </select>

            <input
              type="number"
              placeholder="Quantidade de gols"
              className={styles.input}
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />

            <button
              type="button"
              className={styles.buttonAdd}
              onClick={handleAddPlayer}
            >
              Adicionar Jogador
            </button>

            <div className={styles.playersList}>
              <h2>Jogadores Adicionados</h2>
              <ul>
                {selectedPlayers.map((playerData, index) => (
                  <li key={index}>
                    {playerData.player} - Gols: {playerData.score}
                  </li>
                ))}
              </ul>
            </div>

            <button className={styles.buttonAdd} type="submit">
              Finalizar Jogo
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
