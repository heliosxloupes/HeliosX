import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.brandHeader}>
              <div className={styles.logoIcon}>
                <span>H</span>
              </div>
              <span className={styles.logoText}>HeliosX</span>
            </div>
            <p className={styles.brandDescription}>
              Premium surgical loupes at fair prices. Built by a plastic surgery resident, for the medical community.
            </p>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Navigation</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/" className={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/product" className={styles.link}>
                  Product
                </Link>
              </li>
              <li>
                <Link href="/guides" className={styles.link}>
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className={styles.link}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Company</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/#mission" className={styles.link}>
                  Mission
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.link}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.link}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Socials</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} HeliosX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}











