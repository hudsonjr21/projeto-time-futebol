import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '@/src/components/Header';
import { setupAPIClient } from '../../services/api';

type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  home_team_id: string;
  away_team_id: string;
  day: string;
  scores: Array<{
    home_score: number;
    away_score: number;
  }>;
};

type Score = {
  game_id: string;
  home_score: number;
  away_score: number;
};

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export default function TablePage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    async function fetchGamesFromDatabase() {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get('/games'); // Substitua pela rota correta para buscar a lista de jogos
        return response.data || [];
      } catch (error) {
        console.error('Erro ao buscar jogos do banco de dados:', error);
        return [];
      }
    }

    async function fetchAllScores() {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get('/score');
        return response.data || [];
      } catch (error) {
        console.error('Erro ao buscar placares do banco de dados:', error);
        return [];
      }
    }

    async function fetchTeamsForGame(homeTeamId: string, awayTeamId: string) {
      const apiClient = setupAPIClient();
      try {
        const teamsResponse = await apiClient.get('/team'); // Rota correta para buscar a lista de times
        const teamsList = teamsResponse.data;

        const homeTeam = teamsList.find((team) => team.id === homeTeamId)?.name || '';
        const awayTeam = teamsList.find((team) => team.id === awayTeamId)?.name || '';

        return { homeTeam, awayTeam };
      } catch (error) {
        console.error(`Erro ao buscar times do jogo:`, error);
        return { homeTeam: '', awayTeam: '' };
      }
    }

    async function fetchAllGameDetails(gamesList: Game[], scoresList: Score[]) {
      const detailsPromises = gamesList.map(async (game) => {
        const teams = await fetchTeamsForGame(game.home_team_id, game.away_team_id);
        const gameScores = scoresList.filter((score) => score.game_id === game.id);
        return {
          ...game,
          homeTeam: teams.homeTeam,
          awayTeam: teams.awayTeam,
          scores: gameScores,
          day: game.day,
        };
      });

      const gamesWithDetails = await Promise.all(detailsPromises);
      return gamesWithDetails;
    }

    fetchGamesFromDatabase().then((gamesFromDatabase) => {
      fetchAllScores().then((scoresList) => {
        fetchAllGameDetails(gamesFromDatabase, scoresList).then((gamesWithDetails) => {
          setGames(gamesWithDetails);
        });
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
                <th className={styles.thSize}>Dia</th>
                <th>Casa</th>
                <th className={styles.thSize}>Placar</th>
                <th>Visitante</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id}>
                  <td>{formatDate(game.day)}</td>
                  <td>{game.homeTeam}</td>
                  <td>
                    {game.scores ? (
                      game.scores.map((score, index) => (
                        <span key={index}>
                          {score.home_score} - {score.away_score}
                        </span>
                      ))
                    ) : (
                      <span>Placar não disponível</span>
                    )}
                  </td>
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