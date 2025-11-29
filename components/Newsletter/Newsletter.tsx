'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
    setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className={styles.trigger} aria-label="Newsletter">
          <span>Newsletter</span>
          <span className={styles.subtitle}>Get updates · No spam</span>
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>Newsletter</Dialog.Title>
          <Dialog.Description className={styles.description}>
            Sign up for updates, guides and more resources. No spam.
          </Dialog.Description>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="E-MAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.submitButton}>
              Subscribe
            </button>
          </form>
          
          <Dialog.Close asChild>
            <button className={styles.closeButton} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}










