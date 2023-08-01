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
        <strong>{game[0].game.day}</strong> 
      </span>

      {game.map((gameDetail) => (
        <section key={gameDetail.id} className={styles.containerItem}>
          <div className={styles.playerNameContainer}>
            {Array.from({ length: gameDetail.score }).map((_, index) => (
              <IoMdFootball key={index} color="#FFF" size={24} />
            ))}
            <strong>{gameDetail.player.name}</strong>
          </div>
        </section>
      ))}
    </div>

   </Modal>
  )
}