import { useState, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { IoMdFootball } from 'react-icons/io';

type GameDetailProps = {
  id: string;
  name: string;
};

type PlayerData = {
  player_id: string;
  score: number;
};

interface PropsServer {
  teamList: GameDetailProps[];
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export default function addGame({ teamList}: PropsServer) {
  const router = useRouter();

  const [team, setTeam] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);
  const [playerListByTeam, setPlayerListByTeam] = useState<GameDetailProps[]>([]);
  const [score, setScore] = useState('');
  const [player, setPlayer] = useState('');
  const [numberGame, setNumberGame] = useState('');
  const [day, setDay] = useState('');
  const [id, setId] = useState('');
  const [items, setItems] = useState<PlayerData[]>([]);
  const [playerNames, setPlayerNames] = useState({});
  const [selectedPlayerNames, setSelectedPlayerNames] = useState({});
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [selectedGameTeams, setSelectedGameTeams] = useState<GameDetailProps[]>([]);


  async function loadPlayersByTeam(teamId) {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get(`/team/player?team_id=${teamId}`);
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async function handleAddPlayer() {
    if (selectedPlayers.find(p => p.player_id === player)) {
      toast.error('Jogador já foi adicionado.');
      return;
    }

    if (!player || !score) {
      toast.error('Preencha todos os campos.');
      return;
    }

    const playerName = playerListByTeam.find(p => p.id === player)?.name || '';
    setSelectedPlayerNames(prevNames => ({
      ...prevNames,
      [player]: playerName,
    }));

    setSelectedPlayers([
      ...selectedPlayers,
      { player_id: player, score: Number(score) },
    ]);
    setPlayer('');
    setScore('');
  }

  async function handleAdd() {
    try {
      const apiClient = setupAPIClient();
  
      const data = {
        game_id: id,
        players: selectedPlayers,
      };
  
      const response = await apiClient.post('game/add', data);
  
      const newItem = {
        id: response.data.id,
        player_id: selectedPlayers[0].player_id, // Use player_id
        game_id: id,
        score: selectedPlayers[0].score,
      };
  
      setItems(oldArray => [...oldArray, newItem]);

      setPlayer('');
      setScore('');
      setTeam('');

      router.push({
        pathname: '/score',
        query: {
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          game_id: id,
        },
      });

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error); // Exibe a mensagem de erro do back
      } else {
        toast.error('Ops erro ao adicionar!');
      }
    }
  }

  useEffect(() => {
    if (team) {
      loadPlayersByTeam(team).then(players => {
        setPlayerListByTeam(players);
        const namesDict = {};
        players.forEach(player => {
          namesDict[player.id] = player.name;
        });
        setPlayerNames(namesDict);
      });
    }
  }, [team]);

  useEffect(() => {
    const { query } = router;
    const {
      numberGame: queryNumberGame,
      day: queryDay,
      id: queryId,
      homeTeam: queryHome,
      awayTeam: queryAway,
    } = query;

    if (queryNumberGame && queryDay) {
      setNumberGame(queryNumberGame as string);
      setDay(formatDate(queryDay as string));
      setId(queryId as string);

      // Buscar os nomes dos times a partir dos IDs
      const homeTeamName = teamList.find(team => team.id === queryHome)?.name || '';
      const awayTeamName = teamList.find(team => team.id === queryAway)?.name || '';
      
      setHomeTeam(homeTeamName);
      setAwayTeam(awayTeamName);

      const homeTeamId = queryHome as string;
      const awayTeamId = queryAway as string;

      // Filtrar a lista de times para incluir apenas os times associados ao jogo
      const filteredTeams  = teamList.filter(team => team.id === homeTeamId || team.id === awayTeamId);
      setSelectedGameTeams(filteredTeams);
    }
  }, [router.query, teamList]);

  return (
    <>
      <Head>
        <title>Detalhes Jogo - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>

          <h3>JOGO N° {numberGame} - {day}</h3>
          <h1> {homeTeam} x {awayTeam}</h1>

          <form className={styles.form}>

            <select
              value={team}
              onChange={(e) => {
                setTeam(e.target.value);
              }}
            >
              <option value="">Selecione um time...</option>
              {selectedGameTeams.map((team) => {
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
              className={styles.buttonAdd2}
              onClick={handleAddPlayer}
            > +
            </button>

            <div className={styles.containerList}>
              <h2>Gols do Jogo</h2>
              <ul className={styles.list}>
                {selectedPlayers.map((playerData, index) => (
                  <li key={index} className={styles.item}>
                    <div className={styles.playerNameContainer}>
                    <strong>{selectedPlayerNames[playerData.player_id]}</strong>
                      {Array.from({ length: playerData.score }).map((_, index) => (
                        <IoMdFootball key={index} color="#FFF" size={24} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button 
            className={styles.buttonAdd} 
            type="button"
            onClick={handleAdd}
            >
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
