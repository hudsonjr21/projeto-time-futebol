import Modal from 'react-modal';
import styles from './style.module.scss';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi'
import { IoMdFootball} from 'react-icons/io'
import { GameDetailProps } from '@/src/pages/dashboard';
import { setupAPIClient } from '@/src/services/api';

interface ModalGameProps{
  isOpen: boolean;
  onRequestClose: () => void;
  game: GameDetailProps[];
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function ModalGame({ isOpen, onRequestClose, game }: ModalGameProps){

  const customStyles = {
    content:{
      top: '50%',
      bottom: 'auto',
      left: '50%',
      right: 'auto',
      padding: '30px',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#393e46'
    }
  };

  const [teamNames, setTeamNames] = useState({ homeTeamName: '', awayTeamName: '' });
  const [playerNames, setPlayerNames] = useState<{ [playerId: string]: string }>({});
  const [scores, setScores] = useState<{ 
    home_score: number; away_score: number, game_id: string 
  }[]>([]);
  const [playerScores, setPlayerScores] = useState<{ score: number, player_id: string }[]>([]);

  useEffect(() => {
    const fetchTeamsDetails = async () => {
      const apiClient = setupAPIClient();
      try {
        const teamResponse = await apiClient.get(`/team`);
        const teams = teamResponse.data;

        const homeTeam = teams.find((team) => team.id === game[0].game.home_team_id);
        const awayTeam = teams.find((team) => team.id === game[0].game.away_team_id);

        setTeamNames({
          homeTeamName: homeTeam ? homeTeam.name : 'Time não encontrado',
          awayTeamName: awayTeam ? awayTeam.name : 'Time não encontrado',
        });
      } catch (error) {
        console.error('Erro ao buscar detalhes dos times:', error);
      }
    };

    const fetchScores = async () => {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get(`/score?game_id=${game[0].game_id}`);
        setScores(response.data);
        
      } catch (error) {
        console.error('Erro ao buscar placares:', error);
      }
    };

    const fetchPlayerScores = async () => {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get(`/game/detail?game_id=${game[0].game_id}`);
        setPlayerScores(response.data);

        const playerResponse = await apiClient.get(`/player`);
        const players = playerResponse.data;

        const names = players.reduce((acc, player) => {
          acc[player.id] = player.name;
          return acc;
        }, {});

        setPlayerNames(names);

      } catch (error) {
        console.error('Erro ao buscar placares:', error);
      }
    };

    if (isOpen) {
      fetchTeamsDetails();
      fetchScores();
      fetchPlayerScores();
    }
  }, [isOpen, game]);

  const gameDetail = game.find(detail => detail.game.id === game[0].game_id);
  if (!gameDetail) {
    return null;
  }

  const gameScores = scores.filter(score => score.game_id === gameDetail.game.id);

  return(

    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
    >

    <button
      type="button"
      onClick={onRequestClose}
      className={`${styles.buttonFix} ${styles.closeButton}`}
    >
      <FiX size={30} color="#f34748" />
    </button>


    <div className={styles.container}>

    <h3>
      Jogo n° {gameDetail.game.numberGame} - {formatDate(gameDetail.game.day as string)}
    </h3>
    <h2>
      {teamNames.homeTeamName} {gameScores.map(score => `${score.home_score} x ${score.away_score}`).join(', ')} {teamNames.awayTeamName}
    </h2>
        <span className={styles.table}>
        </span>

        <div className={styles.containerItem}>
          <div className={styles.playerNameContainer}>
            {playerScores
              .sort((a, b) => b.score - a.score) // Ordena os jogadores por mais gols primeiro
              .map((playerScore, index) => (
                <div key={index} className={styles.playerRow}>
                  <div className={styles.playerIconRow}>
                    {Array.from({ length: playerScore.score }).map((_, iconIndex) => (
                      <IoMdFootball key={iconIndex} color="#FFF" size={24} />
                    ))}
                  </div>
                  <strong>{playerNames[playerScore.player_id]}</strong>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}