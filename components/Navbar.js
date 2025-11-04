'use client';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/transcribe" className={styles.navLink}>Transcribe</Link>
        <Link href="/share" className={styles.navLink}>Share</Link>
      </div>
    </nav>
  );
}
