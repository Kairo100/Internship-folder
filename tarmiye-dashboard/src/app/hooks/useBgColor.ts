'use client'

import { COLORS } from '@/styles/constants'

export default function useBgColor() {
  return {
    primaryLight: { backgroundColor: `${COLORS.primary}20` },
    secondaryLight: { backgroundColor: `${COLORS.secondary}20` }
  }
}
