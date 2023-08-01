import { useState, ChangeEvent, FormEvent } from 'react'
import Head from 'next/head';
import styles from './styles.module.scss';
import {Header} from '../../components/Header'

import { canSSRAuth } from '../../utils/canSSRAuth'

import { FiUpload } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

import { toast } from 'react-toastify'

type GameDetailProps = {
  id: string;
  name: string;
}

interface TeamProps{
  teamList: GameDetailProps[];
}

export default function Player({ teamList }: TeamProps){

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [birthday, setBirthday] = useState('');

  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);

  const [teams, setTeams] = useState(teamList || [])
  const [teamSelected, setTeamSelected] = useState(0)


  function handleFile(e: ChangeEvent<HTMLInputElement>){

    if(!e.target.files){
      return;
    }

    const image = e.target.files[0];

    if(!image){
      return;
    }

    if(image.type === 'image/jpeg' || image.type === 'image/png'){

      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]))

    }

  }

  //Quando você seleciona uma nova categoria na lista
  function handleChangeTeam(event){
    // console.log("POSICAO DA CATEGORIA SELECIONADA ", event.target.value)
   //console.log('Categoria selecionada ', categories[event.target.value])

    setTeamSelected(event.target.value)

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
        <title>Novo Jogador - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header/>

        <main className={styles.container}>
          <h1>Novo Jogador</h1>

          <form className={styles.form} onSubmit={handleRegister}>

            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={30} color="#FFF" />
              </span>

              <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

              {avatarUrl && (     
                  <img 
                    className={styles.preview}
                    src={avatarUrl}
                    alt="Foto do jogador" 
                    width={250}
                    height={250}
                  />
              )}

            </label>


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
  const apliClient = setupAPIClient(ctx)

  const response = await apliClient.get('/team');
  //console.log(response.data);

  return {
    props: {
      teamList: response.data
    }
  }
})