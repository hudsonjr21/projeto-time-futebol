import { useContext  } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'

import { FiLogOut } from 'react-icons/fi'

import { AuthContext } from '../../contexts/AuthContext'

export function Header(){

  const { signOut } = useContext(AuthContext)

  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" legacyBehavior>
          <img src="/logo.png" className={styles.headerContainer} />
        </Link>

        <nav className={styles.menuNav}>
          <Link href="/" legacyBehavior>
            <a>Home</a>
          </Link>

          <Link href="/table" legacyBehavior>
            <a>Tabela</a>
          </Link>

          <Link href="/raking" legacyBehavior>
            <a>Classificação</a>
          </Link>

          <Link href="/playerScorer" legacyBehavior>
            <a>Artilheiros</a>
          </Link>

          <Link href="/game" legacyBehavior>
            <a>Jogo</a>
          </Link>   


          <Link href="/team" legacyBehavior>
            <a>Time</a>
          </Link>

          <Link href="/player" legacyBehavior>
            <a>Jogador</a>
          </Link>   

          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24} />
          </button>       
        </nav>

      </div>
    </header>
  )
}