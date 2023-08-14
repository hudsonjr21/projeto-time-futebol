import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss'; // Importe seus estilos CSS aqui
import { Header } from '@/src/components/Header';
import { setupAPIClient } from '../../services/api';

type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
};

export default function TablePage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    async function fetchGamesFromDatabase() {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get('/games'); // Substitua pela rota correta para buscar a lista de jogos
        return response.data; // Certifique-se de que a resposta esteja no formato esperado (id, home_team_id, away_team_id)
      } catch (error) {
        console.error('Erro ao buscar jogos do banco de dados:', error);
        return [];
      }
    }

    async function fetchScoresForGame(gameId: string) {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get(`/score?game_id=${gameId}`); // Substitua pela rota correta para buscar o placar do jogo
        return response.data; // Certifique-se de que a resposta esteja no formato esperado (home_score, away_score)
      } catch (error) {
        console.error(`Erro ao buscar placar do jogo ${gameId}:`, error);
        return { homeScore: 0, awayScore: 0 };
      }
    }

    async function fetchTeamsForGame(gameId: string) {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get(`/games?id=${gameId}`); // Substitua pela rota correta para buscar os detalhes do jogo
        return response.data[0] || { homeTeam: '', awayTeam: '' };
      } catch (error) {
        console.error(`Erro ao buscar times do jogo ${gameId}:`, error);
        return { homeTeam: '', awayTeam: '' };
      }
    }

    async function fetchAllGameDetails(gamesList: Game[]) {
      const detailsPromises = gamesList.map(async (game) => {
        const teams = await fetchTeamsForGame(game.id);
        const scores = await fetchScoresForGame(game.id);
        return { ...game, ...teams, ...scores };
      });

      const gamesWithDetails = await Promise.all(detailsPromises);
      return gamesWithDetails;
    }

    fetchGamesFromDatabase().then((gamesFromDatabase) => {
      fetchAllGameDetails(gamesFromDatabase).then((gamesWithDetails) => {
        setGames(gamesWithDetails);
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Tabela de Jogos - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Tabela de Jogos</h1>

          <table className={styles.gameTable}>
            <thead>
              <tr>
                <th>Casa</th>
                <th>Placar</th>
                <th>Visitante</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id}>
                  <td>{game.homeTeam}</td>
                  <td>{`${game.homeScore} - ${game.awayScore}`}</td>
                  <td>{game.awayTeam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}