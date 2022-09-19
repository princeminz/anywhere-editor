import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import vitePluginRequire from "vite-plugin-require";
import manifest from './manifest.json'
import monacoEditorPlugin from 'vite-plugin-monaco-editor';


export default defineConfig({
  plugins: [
    react(),
    vitePluginRequire({}),
    monacoEditorPlugin({}),
    crx({ manifest }),
  ],
})