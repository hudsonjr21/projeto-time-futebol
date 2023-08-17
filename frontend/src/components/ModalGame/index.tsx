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

    if (isOpen) {
      fetchTeamsDetails();
    }
  }, [isOpen, game]);


  const gameDetail = game.find(detail => detail.game.id === game[0].game_id);
  if (!gameDetail) {
    return null;
  }

  return(
   <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
   >

    <button
    type="button"
    onClick={onRequestClose}
    className={styles.buttonFix}
    >
      <FiX size={30} color="#f34748" />
    </button>

    <div className={styles.container}>

    <h3>
      Jogo n° {gameDetail.game.numberGame} - {formatDate(gameDetail.game.day as string)}
    </h3>
    <h2>{teamNames.homeTeamName} x {teamNames.awayTeamName}</h2>
        <span className={styles.table}>
          <strong>N°{gameDetail.game.numberGame}</strong>
        </span>

        <div className={styles.containerItem}>
          <div className={styles.playerNameContainer}>
            {Array.from({ length: gameDetail.score }).map((_, index) => (
              <IoMdFootball key={index} color="#FFF" size={24} />
            ))}
            <strong>{gameDetail.player.name}</strong>
          </div>
        </div>
      </div>
    </Modal>
  );
}