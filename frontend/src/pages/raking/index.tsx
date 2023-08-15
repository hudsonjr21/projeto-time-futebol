import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '@/src/components/Header';
import { setupAPIClient } from '@/src/services/api';

type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  home_score: number;
  away_score: number;
  home_team_id: string;
  away_team_id: string;
  game_id: string;
};

type TeamStats = {
  teamId: string;
  teamName: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  gamesPlayed: number;
};

export default function Raking() {
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);

  useEffect(() => {
    async function fetchData() {
      const apiClient = setupAPIClient();

      try {
        const gamesResponse = await apiClient.get('/games');
        const teamsResponse = await apiClient.get('/team');
        const scoresResponse = await apiClient.get('/score');

        const gamesList: Game[] = gamesResponse.data;
        const teamsList = teamsResponse.data;
        const scoresList: Game[] = scoresResponse.data;

        const teamStats: { [teamId: string]: TeamStats } = {};

        gamesList.forEach((game) => {
          if (!teamStats[game.home_team_id]) {
            teamStats[game.home_team_id] = {
              teamId: game.home_team_id,
              teamName: teamsList.find((team) => team.id === game.home_team_id)?.name || '',
              gamesPlayed: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              goalDifference: 0,
              points: 0,
            };
          }

          if (!teamStats[game.away_team_id]) {
            teamStats[game.away_team_id] = {
              teamId: game.away_team_id,
              teamName: teamsList.find((team) => team.id === game.away_team_id)?.name || '',
              gamesPlayed: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              goalDifference: 0,
              points: 0,
            };
          }

            const homeScore = scoresList
            .filter((score) => score.game_id === game.id)
            .reduce((total, score) => total + score.home_score, 0);
        
            const awayScore = scoresList
            .filter((score) => score.game_id === game.id)
            .reduce((total, score) => total + score.away_score, 0);

          teamStats[game.home_team_id].gamesPlayed++;
          teamStats[game.away_team_id].gamesPlayed++;

          teamStats[game.home_team_id].goalsFor += homeScore;
          teamStats[game.home_team_id].goalsAgainst += awayScore;
          teamStats[game.away_team_id].goalsFor += awayScore;
          teamStats[game.away_team_id].goalsAgainst += homeScore;

          if (homeScore > awayScore) {
            teamStats[game.home_team_id].wins++;
            teamStats[game.home_team_id].points += 3;
            teamStats[game.away_team_id].losses++;
          } else if (awayScore > homeScore) {
            teamStats[game.away_team_id].wins++;
            teamStats[game.away_team_id].points += 3;
            teamStats[game.home_team_id].losses++;
          } else if (awayScore === homeScore){
            teamStats[game.home_team_id].draws++;
            teamStats[game.home_team_id].points++;
            teamStats[game.away_team_id].draws++;
            teamStats[game.away_team_id].points++;
          }

          teamStats[game.home_team_id].goalDifference =
            teamStats[game.home_team_id].goalsFor - teamStats[game.home_team_id].goalsAgainst;
          teamStats[game.away_team_id].goalDifference =
            teamStats[game.away_team_id].goalsFor - teamStats[game.away_team_id].goalsAgainst;
        });

        const sortedTeamStats = Object.values(teamStats).sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return b.goalDifference - a.goalDifference;
        });

        setTeamStats(sortedTeamStats);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Classificação - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Classificação</h1>

          <section className={styles.standings}>
            <table className={styles.standingsTable}>
              <thead>
                <tr>
                  <th>Classificação</th>
                  <th>J</th>
                  <th>P</th>
                  <th>V</th>
                  <th>E</th>
                  <th>D</th>
                  <th>GP</th>
                  <th>GC</th>
                  <th>SG</th>
                </tr>
              </thead>
              <tbody>
                {teamStats.map((team, index) => (
                  <tr key={team.teamId}>
                    <td>{index + 1} - {team.teamName}</td>
                    <td>{team.gamesPlayed}</td>
                    <td>{team.points}</td>
                    <td>{team.wins}</td>
                    <td>{team.draws}</td>
                    <td>{team.losses}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td>{team.goalDifference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  );
}
