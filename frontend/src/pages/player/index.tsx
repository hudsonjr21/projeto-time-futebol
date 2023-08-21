import { useState, ChangeEvent, FormEvent } from 'react'
import Head from 'next/head';
import styles from './styles.module.scss';
import {Header} from '../../components/Header'

import { canSSRAuth } from '../../utils/canSSRAuth'

import { FiUpload } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

import { toast } from 'react-toastify'
import { canAccessAdminRoute } from '@/src/utils/canAccessAdminRoute';

type GameDetailProps = {
  id: string;
  name: string;
}

interface TeamProps{
  teamList: GameDetailProps[];
  positions: GameDetailProps[]
}

export default function Player({ teamList, positions }: TeamProps){

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [birthday, setBirthday] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);
  const [team, setTeam] = useState('');



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

  async function handleRegister(event: FormEvent){
    event.preventDefault();

    try{
      const data = new FormData();

      if(name === '' || position === '' || birthday === '' || imageAvatar === null || team === ''){
        toast.error("Preencha todos os campos!");
        return;
      }

      data.append('name', name);
      data.append('position_id', position);
      data.append('birthday', birthday);
      data.append('team_id', team);
      data.append('file', imageAvatar);

      const apiClient = setupAPIClient();

      await apiClient.post('/player', data);

      toast.success('Jogador cadastrado com sucesso!')

      setName('');
      setPosition('');
      setBirthday('');
      setImageAvatar(null);
      setAvatarUrl('');
      setTeam('');

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error); // Exibe a mensagem de erro do back
      } else {
        toast.error('Ops erro ao cadastrar!');
      }
    }
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

            <select value={team} onChange={(e) => setTeam(e.target.value)}>
              <option value="">Selecione um time...</option>
              {teamList.map((team) => {
                return (
                  <option key={team.id} value={team.id}>
                    {team.name}
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

             <select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="">Selecione a posição do jogador...</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>

            <input 
              type="date"
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

export const getServerSideProps = canAccessAdminRoute(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const teamResponse = await apiClient.get('/team');
  const positionResponse = await apiClient.get('/position');

  return {
    props: {
      teamList: teamResponse.data,
      positions: positionResponse.data,
    },
  };
});