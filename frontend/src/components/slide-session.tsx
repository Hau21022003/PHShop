'use client'

import authApiRequest from '@/api-requests/auth'
import { useEffect } from 'react'
import { differenceInMinutes } from 'date-fns'

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date()
      const sessionTokenExpiresAt = localStorage.getItem(
        'sessionTokenExpiresAt'
      )
      const expiresAt = sessionTokenExpiresAt
        ? new Date(sessionTokenExpiresAt)
        : new Date()
      if (differenceInMinutes(expiresAt, now) < 20) {
        const res =
          await authApiRequest.slideSessionFromNextClientToNextServer()
        localStorage.setItem(
          'sessionTokenExpiresAt',
          res.payload.data.accessTokenExpiresAt
        )
      }
    }, 1000 * 60 * 20)
    return () => clearInterval(interval)
  }, [])
  return null
}
