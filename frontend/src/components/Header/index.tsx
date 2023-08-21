import { useContext, useState } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';

import { FiLogOut, FiUser } from 'react-icons/fi';

import { AuthContext } from '../../contexts/AuthContext';

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { signOut, isAdmin } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" legacyBehavior>
          <img src="/logo.png" className={styles.headerLogo} />
        </Link>

        <nav className={styles.menuNav}>
          <Link href="/" legacyBehavior>
            <a>Home</a>
          </Link>

          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <a>Tabela</a>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/table" legacyBehavior>
                  <a>Jogos</a>
                </Link>
                <Link href="/raking" legacyBehavior>
                  <a>Classificação</a>
                </Link>
                <Link href="/playerScorer" legacyBehavior>
                  <a>Artilheiros</a>
                </Link>
              </div>
            )}
          </div>

          {isAdmin && (
            <div
              className={styles.dropdownContainer}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <a>Cadastro</a>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link href="/game" legacyBehavior>
                    <a>Jogo</a>
                  </Link>
                  <Link href="/team" legacyBehavior>
                    <a>Time</a>
                  </Link>
                  <Link href="/player" legacyBehavior>
                    <a>Jogador</a>
                  </Link>
                </div>
              )}
            </div>
          )}
          <button>
          <Link href="/profile" legacyBehavior>
            <FiUser color="#FFF" size={24} />
            </Link>
          </button>
          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}