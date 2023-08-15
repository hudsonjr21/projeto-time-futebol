import React, { useEffect, useState } from 'react';
import { setupAPIClient } from '@/src/services/api';
import styles from './styles.module.scss';
import Head from 'next/head';
import { Header } from '@/src/components/Header';

type Player = {
  id: string;
  name: string;
  team: string;
};

type GameDetail = {
  game_id: string;
  player_id: string;
  score: number;
};

type PlayerStats = {
  player: Player;
  goals: number;
};

export default function TopScorers() {
  const [topScorers, setTopScorers] = useState<PlayerStats[]>([]);

  useEffect(() => {
    async function fetchTopScorers() {
      const apiClient = setupAPIClient();
      try {
        const playersResponse = await apiClient.get('/player');
        const gameDetailsResponse = await apiClient.get('/game/detail');

        const playersList: Player[] = playersResponse.data;
        const gameDetailsList: GameDetail[] = gameDetailsResponse.data;

        console.log('Players List:', playersList);
        console.log('Game Details List:', gameDetailsList);

        const playerStats: { [playerId: string]: PlayerStats } = {};

        gameDetailsList.forEach((gameDetail) => {
          const playerId = gameDetail.player_id;
          const goals = gameDetail.score; 

          if (!playerStats[playerId]) {
            const player = playersList.find((player) => player.id === playerId);
            if (player) {
              playerStats[playerId] = {
                player,
                goals: 0,
              };
            }
          }

          console.log('Player ID:', playerId);
          console.log('Goals:', goals);

          playerStats[playerId].goals += goals;
        });

        const sortedTopScorers = Object.values(playerStats).sort((a, b) => b.goals - a.goals);

        setTopScorers(sortedTopScorers);
      } catch (error) {
        console.error('Erro ao buscar artilheiros:', error);
      }
    }

    fetchTopScorers();
  }, []);

  return (
    <>
      <Head>
        <title>Artilheiros - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Artilheiros</h1>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Jogador</th>
                  <th>Time</th>
                  <th>Gols</th>
                </tr>
              </thead>
              <tbody>
                {topScorers.map((playerStat, index) => (
                  <tr key={playerStat.player.id}>
                    <td>{index + 1}</td>
                    <td>{playerStat.player.name}</td>
                    <td>{playerStat.player.team}</td>
                    <td>{playerStat.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
