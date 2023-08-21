import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { AuthContext } from '@/src/contexts/AuthContext';
import { setupAPIClient } from '@/src/services/api';
import { Header } from '@/src/components/Header';
import { toast } from 'react-toastify';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedCellNumber, setEditedCellNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/me');
        setUserData(response.data);
        setEditedName(response.data.name);
        setEditedEmail(response.data.email);
        setEditedCellNumber(response.data.cellNumber);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const apiClient = setupAPIClient();
      await apiClient.put('/user', {
        name: editedName,
        email: editedEmail,
        cellNumber: editedCellNumber,
      });

      // if (currentPassword && newPassword) {
      //   await apiClient.put('/user/password', {
      //     currentPassword,
      //     newPassword,
      //   });
      // }

      toast.success('Informações atualizadas com sucesso');
      setUserData({
        ...userData,
        name: editedName,
        email: editedEmail,
        cellNumber: editedCellNumber,
      });
      setIsEditing(false);
      // setCurrentPassword('');
      // setNewPassword('');
    } catch (error) {
      toast.error('Erro ao atualizar informações');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedName(userData.name);
    setEditedEmail(userData.email);
    setEditedCellNumber(userData.cellNumber);
    // setCurrentPassword('');
    // setNewPassword('');
  };

  if (!user || !userData) {
    return <p>Loading...</p>;
  }

  return (
  <>
      <Head>
      <title>Meu Perfil - JOGOS ENTRE AMIGOS</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Meu Perfil</h1>

          <div className={styles.login}>

          {isEditing ? (
          <>
            <Input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <Input
              type="text"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
            <Input
              type="text"
              value={editedCellNumber}
              onChange={(e) => setEditedCellNumber(e.target.value)}
            />
            {/* <Input
              type="password"
              placeholder="Senha Atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Nova Senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            /> */}
            <div className={styles.buttonContainer}>
              <Button onClick={handleSaveChanges} loading={loading}>
                Salvar
              </Button>
              <Button onClick={handleCancelEditing}>
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Nome:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Celular: </strong> {userData.cellNumber}</p>
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          </>
        )}
        </div>
        </main>
      </div>
    </>
  );
}
