import React, { useEffect, useState } from 'react';
import { setupAPIClient } from '@/src/services/api';
import styles from './styles.module.scss';
import Head from 'next/head';
import { Header } from '@/src/components/Header';

type Player = {
  id: string;
  name: string;
  team: string;
  team_id?: string;
};

type Team = {
    id: string;
    name: string;
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
          // Buscar detalhes dos jogos
          const gameDetailsResponse = await apiClient.get('/game/detail');
          const gameDetails: GameDetail[] = gameDetailsResponse.data;
      
          // Buscar informações dos jogadores
          const playerResponse = await apiClient.get('/player');
          const players: Player[] = playerResponse.data;
      
          // Buscar informações dos times
          const teamResponse = await apiClient.get('/team');
          const teams: Team[] = teamResponse.data;
      
          // Calcular os gols de cada jogador
          const playerGoals: { [playerId: string]: number } = {};
      
          // Loop pelos detalhes dos jogos para calcular os gols por jogador
          gameDetails.forEach((detail) => {
            const { player_id, score } = detail;
            if (player_id in playerGoals) {
              playerGoals[player_id] += score;
            } else {
              playerGoals[player_id] = score;
            }
          });
      
          // Mapear os artilheiros com nome, time e gols
          const topScorersData: PlayerStats[] = Object.keys(playerGoals).map((playerId) => {
            const player = players.find((p) => p.id === playerId);
            const teamId = player.team_id; // Obtém o team_id do jogador
            const team = teams.find((t) => t.id === teamId); // Encontra o time correspondente usando o team_id
            const teamName = team ? team.name : 'Time Desconhecido'; // Usa o nome do time ou 'Time Desconhecido'
            const playerName = player ? player.name : 'Jogador Desconhecido'; // Usa o nome do jogador ou 'Jogador Desconhecido'
            
            return {
              player: { id: playerId, name: playerName, team: teamName }, // Cria um objeto de jogador com nome e time
              goals: playerGoals[playerId], // Obtém o número de gols do jogador
            };
          });
      
          // Ordenar os artilheiros por número de gols
          topScorersData.sort((a, b) => b.goals - a.goals);
      
          // Atualizar o estado com os dados dos artilheiros
          setTopScorers(topScorersData);
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
          <h1>Artilharia</h1>
          <div className={styles.standings}>
            <table className={styles.standingsTable}>
              <thead>
                <tr>
                  <th>Raking</th>
                  <th>Time</th>
                  <th>Gols</th>
                </tr>
              </thead>
              <tbody>
                {topScorers.map((playerStats, index) => (
                  <tr key={playerStats.player.id}>
                    <td>{index + 1} - {playerStats.player.name}</td>
                    <td>{playerStats.player.team}</td>
                    <td>{playerStats.goals}</td>
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
