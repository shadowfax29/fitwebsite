import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE is set by the GitHub Pages workflow (/<repo>/); everywhere else the site lives at the root
export default defineConfig({ base: process.env.BASE || '/', plugins: [react()] })
