import { useState, FormEvent, useEffect } from 'react'
import Head from 'next/head';
import styles from './styles.module.scss';
import {Header} from '../../components/Header'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'

type GameDetailProps = {
    id: string;
    name: string;
  }
  
  interface PropsSever{
    teamList: GameDetailProps[];
    playerList: GameDetailProps[];
  }

export default function addGame( { teamList, playerList }: PropsSever ){

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [birthday, setBirthday] = useState('');

  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);

  const [teams, setTeams] = useState(teamList || [])
  const [teamSelected, setTeamSelected] = useState(0)
  const [players, setPlayer] = useState(playerList || [])
  const [playerSelected, setPlayerSelected] = useState(0)


  useEffect (() => {
    async function loadPlayer() {
      if (!teamSelected) return;

      try {
        const apiClient = setupAPIClient();
        
        const response = await apiClient.get('/team/player', {
          params: {
            team_id: teamSelected,
          },
        });

        setPlayer(response.data);
        setPlayerSelected(response.data[0]);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }

    loadPlayer();
  }, [teamSelected]);


  //Quando você seleciona uma nova time na lista
  function handleChangeTeam(event){
    setTeamSelected(event.target.value)

  }

  
  //Quando você seleciona uma novo jogador da lista
  function handleChangePlayer(event){
    setPlayerSelected(event.target.value)

  }

  async function handleRegister(event: FormEvent){
    event.preventDefault();

    try{
      const data = new FormData();

      if(name === '' || position === '' || birthday === '' || imageAvatar === null){
        toast.error("Preencha todos os campos!");
        return;
      }

      if (teamSelected === 0) {
        toast.error("Selecione um time antes de cadastrar!");
        return;
      }

      data.append('name', name);
      data.append('position', position);
      data.append('birthday', birthday);
      data.append('team_id', teams[teamSelected].id);
      data.append('player_id', players[playerSelected].id);
      data.append('file', imageAvatar);

      const apiClient = setupAPIClient();

      await apiClient.post('/player', data);

      toast.success('Jogador cadastrado com sucesso!')

    }catch(err){
      console.log(err);
      toast.error("Ops erro ao cadastrar!")
    }

    setName('');
    setPosition('');
    setBirthday('')
    setImageAvatar(null);
    setAvatarUrl('');

  }

  return(
    <>
      <Head>
        <title>Detalhes Jogo - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header/>

        <main className={styles.container}>
          <h1>Detalhes do Jogo</h1>

          <form className={styles.form} onSubmit={handleRegister}>

            <select value={teamSelected} onChange={handleChangeTeam} >
            <option value={0}>Selecione um time...</option>
                {teams.map( (gameDetail, index) => {
                  return(
                    <option key={gameDetail.id} value={index + 1}>
                      {gameDetail.name}
                    </option>
                  )
                })}
            </select>

            <select value={playerSelected} onChange={handleChangePlayer}>
                <option value={0}>Selecione um Jogador...</option>
                {players.map((playerDetail, index) => {
                    return (
                    <option key={playerDetail.id} value={index + 1}>
                        {playerDetail.name}
                    </option>
                    );
                })}
            </select>

            <input 
            type="text"
            placeholder="Digite o nome do jogador"
            className={styles.input}
            value={name}
            onChange={ (e) => setName(e.target.value) }
            />

            <input 
            type="text"
            placeholder="Posição do jogador"
            className={styles.input}
            value={position}
            onChange={ (e) => setPosition(e.target.value) }
            />      

            <input 
              placeholder="Data Nascimento **/**/****"
              className={styles.input}
              value={birthday}
              onChange={ (e) => setBirthday(e.target.value) }
            /> 

            <button className={styles.buttonAdd} type="submit">
              Cadastrar  
            </button>   

          </form>

        </main>

      </div>
    </>
  )
}

  export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apliClient = setupAPIClient(ctx);
  
    const teamResponse = await apliClient.get('/team');
  
    return {
      props: {
        teamList: teamResponse.data
      }
    };
  });
  
  

  