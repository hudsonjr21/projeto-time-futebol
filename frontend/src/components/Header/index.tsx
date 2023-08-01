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
          <img src="/logo.png" width={800} height={100} />
        </Link>

        <nav className={styles.menuNav}>
          <Link href="/" legacyBehavior>
            <a>Home</a>
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