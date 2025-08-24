'use client'

import React, { ReactNode } from 'react'

export default function BlankLayout({ children }: { children: ReactNode }) {
  return <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>{children}</div>
}
