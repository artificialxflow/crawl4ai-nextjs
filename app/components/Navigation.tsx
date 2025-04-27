'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navigation.module.css'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Universal Web Scraper
        </Link>
        
        <div className={styles.links}>
          <Link 
            href="/" 
            className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
          >
            Scraper
          </Link>
          <Link 
            href="/fields" 
            className={`${styles.link} ${isActive('/fields') ? styles.active : ''}`}
          >
            Field Templates
          </Link>
          <Link 
            href="/history" 
            className={`${styles.link} ${isActive('/history') ? styles.active : ''}`}
          >
            History
          </Link>
        </div>
      </div>
    </nav>
  )
} 