'use client';
import { useRouter } from 'next/navigation';
import styles from './ModeToggle.module.css';

export default function ModeToggle({ mode, onToggle }) {
  const router = useRouter();

  const handleToggle = () => {
    const newMode = mode === 'normal' ? 'tournament' : 'normal';
    onToggle(newMode);
    if (newMode === 'tournament') {
      router.push('/tournament');
    } else {
        router.push('/');
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <span>Normal Mode</span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={mode === 'tournament'}
          onChange={handleToggle}
        />
        <span className={styles.slider}></span>
      </label>
      <span>Tournament Mode</span>
    </div>
  );
}
