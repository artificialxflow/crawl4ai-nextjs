import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Universal Web Scraper</h1>
      <p className={styles.description}>Enter URLs to scrape and extract data</p>
    </main>
  )
}
