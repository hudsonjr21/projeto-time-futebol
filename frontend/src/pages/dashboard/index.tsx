import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';

import { Header } from '../../components/Header'
import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

import { ModalGame } from '../../components/ModalGame'

import Modal from 'react-modal';

type GameProps = {
  id: string;
  day: string;
  name: string | null;
  draft: boolean;
}

interface HomeProps{
  games: GameProps[];
}

export type GameDetailProps = {
  id: string;
  score: number;
  game_id: string;
  player_id: string;
  player:{
    id: string;
    name: string;
    profile: string;
    position: string;
    birthday: string;
  }
  game:{
    id: string;
    day: string | number;
    name: string | null;
  }
}

export default function Dashboard({ games }: HomeProps){

  const [gameList, setGameList] = useState(games || [])

  const [modalGameDetail, setModalGameDetail] = useState<GameDetailProps[]>()
  const [modalVisible, setModalVisible] = useState(false);


  function handleCloseModal(){
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string){
   
     const apiClient = setupAPIClient(); 

     const response = await apiClient.get('/game/detail', {
       params:{
        game_id: id,
       } 
     })

     setModalGameDetail(response.data);
     setModalVisible(true);

  }


  // async function handleFinishItem(id: string){
  //   const apiClient = setupAPIClient();
  //   await apiClient.put('/order/finish', {
  //     order_id: id,
  //   })

  //   const response = await apiClient.get('/orders');

  //   setOrderList(response.data);
  //   setModalVisible(false);
  // }


  async function handleRefreshOrders(){
    const apiClient = setupAPIClient();

    const response = await apiClient.get('/games')
    setGameList(response.data);

  }

  Modal.setAppElement('#__next');

  return(
    <>
    <Head>
      <title>Painel - JOGOS ENTRE AMIGOS</title>
    </Head>
    <div>
      <Header/>
    
      <main className={styles.container}>

        <div className={styles.containerHeader}>
          <h1>Últimos Jogos</h1>
          <button onClick={handleRefreshOrders}>
            <FiRefreshCcw size={25} color="#3fffa3"/>
          </button>
        </div>

        <article className={styles.listOreders}>

          {gameList.length === 0 && (
            <span className={styles.emptyList}>
              Nenhum Jogo adicionado foi encontrado...
            </span>
          )}

          {gameList.map( gameDetail => (
            <section  key={gameDetail.id} className={styles.orderItem}> 
              <button onClick={ () => handleOpenModalView(gameDetail.id) }>
                <div className={styles.tag}></div>
                <span>Dia do Jogo {gameDetail.day}</span>
              </button>
            </section>
          ))}
                 
        </article>

      </main>

      { modalVisible && (
        <ModalGame
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          game={modalGameDetail}
        />
      )}

    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get('/games');
  //console.log(response.data);


  return {
    props: {
      games: response.data
    }
  }
})