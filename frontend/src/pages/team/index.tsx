import { useState, FormEvent, ChangeEvent } from 'react'
import Head from "next/head"
import {Header} from '../../components/Header'
import styles from './styles.module.scss'

import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'

import { canSSRAuth } from '../../utils/canSSRAuth'
import { FiUpload } from 'react-icons/fi'

export default function Team(){
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);

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

    if(name === '' || imageAvatar === null){
      toast.error("Preencha todos os campos!");
      return;
    }

      data.append('name', name);
      data.append('file', imageAvatar);

      const apiClient = setupAPIClient();

      await apiClient.post('/team', data);

      toast.success('Time cadastrado com sucesso!')

      setName('');
      setImageAvatar(null);
      setAvatarUrl('');

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error); // Exibe a mensagem de erro do backend
      } else {
        toast.error("Ops, erro ao cadastrar!");
      }
    }
  }


  return(
    <>
    <Head>
      <title>Novo Time - JOGOS ENTRE AMIGOS</title>
    </Head>
    <div>
      <Header/>

      <main className={styles.container}>
        <h1>Cadastrar Times</h1>

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
                      alt="Foto do time" 
                      width={250}
                      height={250}
                    />
                )}
          </label>

          <input 
          type="text" 
          placeholder="Digite o nome do Time"
          className={styles.input}
          value={name}
          onChange={ (e) => setName(e.target.value) }
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

  return {
    props: {}
  }

})