export const metadata = {
  title: 'QMOI Alpha AI - Comprehensive AI System',
  description: 'QMOI Alpha AI - Advanced AI system with friendship enhancement, automation, and comprehensive monitoring',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        /* === QMOI windows layout start === */
// Platform: windows
// Layout features: {
  "theme": "dark",
  "nav": "sidebar",
  "tray": true
}
/* === QMOI windows layout end === */
{children}
      </body>
    </html>
  )
} 