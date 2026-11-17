import {defineConfig} from 'vite';
export default defineConfig({define:{'process.env.NODE_ENV':JSON.stringify('production')},build:{outDir:'web/ui',emptyOutDir:true,lib:{entry:'ui/shell.jsx',formats:['es'],fileName:()=> 'shell.js'},minify:true}});
