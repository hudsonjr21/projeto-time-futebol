import Modal from 'react-modal';
import styles from './style.module.scss';

import { FiX } from 'react-icons/fi'
import { IoMdFootball} from 'react-icons/io'
import { GameDetailProps } from '@/src/pages/dashboard';

interface ModalGameProps{
  isOpen: boolean;
  onRequestClose: () => void;
  game: GameDetailProps[];
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

  // Encontra o detalhe do jogo correto com base no game_id
  const gameDetail = game.find(detail => detail.game.id === game[0].game_id);
  if (!gameDetail) {
    return null; // Não há detalhes do jogo para mostrar
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
    className="react-modal-close"
    style={{ background: 'transparent', border:0 }}
    >
      <FiX size={30} color="#f34748" />
    </button>

    <div className={styles.container}>

    <h2>Detalhes do Jogo</h2>
        <span className={styles.table}>
          <strong>{gameDetail.game.numberGame}</strong>
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