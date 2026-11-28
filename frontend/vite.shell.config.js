import {defineConfig} from 'vite';
// The lab's React library shell (ui/shell.jsx) -> web/ui/shell.js + web/ui/hololab-ar-v3.css.
// The CSS name is pinned because web/index.html links it (Vite would otherwise use the package name).
export default defineConfig({define:{'process.env.NODE_ENV':JSON.stringify('production')},build:{outDir:'web/ui',emptyOutDir:true,lib:{entry:'ui/shell.jsx',formats:['es'],fileName:()=> 'shell.js',cssFileName:'hololab-ar-v3'},minify:true}});
