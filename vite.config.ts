import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

// Plugin middleware personalizado para procesar IA y Stitching de fotos localmente (100% offline)
const localAiPlugin = () => ({
  name: 'local-ai-plugin',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === '/api/process' && req.method === 'POST') {
        const body: Buffer[] = [];
        req.on('data', (chunk: Buffer) => body.push(chunk));
        req.on('end', async () => {
          try {
            const buffer = Buffer.concat(body);
            const contentType = req.headers['content-type'] || '';
            const boundaryMatch = contentType.match(/boundary=(.+)/);
            if (!boundaryMatch) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Falta cabecera boundary en multipart' }));
              return;
            }
            
            const boundary = '--' + boundaryMatch[1];
            const parts: Buffer[] = [];
            let start = 0;
            
            while (true) {
              const nextBoundary = buffer.indexOf(boundary, start);
              if (nextBoundary === -1) break;
              if (start > 0) {
                const partBuffer = buffer.slice(start, nextBoundary - 2); // Quitar \r\n
                parts.push(partBuffer);
              }
              start = nextBoundary + boundary.length + 2; // Saltar boundary y \r\n
            }
            
            const files: { filename: string; data: Buffer }[] = [];
            let targetRoom = 'Habitacion';
            let opType = 'stitch';
            
            for (const part of parts) {
              const headerEnd = part.indexOf('\r\n\r\n');
              if (headerEnd === -1) continue;
              const headerStr = part.slice(0, headerEnd).toString();
              const content = part.slice(headerEnd + 4);
              
              const nameMatch = headerStr.match(/name="([^"]+)"/);
              const filenameMatch = headerStr.match(/filename="([^"]+)"/);
              
              if (filenameMatch) {
                files.push({
                  filename: filenameMatch[1],
                  data: content
                });
              } else if (nameMatch) {
                const value = content.toString().trim();
                if (nameMatch[1] === 'room') targetRoom = value;
                if (nameMatch[1] === 'op') opType = value;
              }
            }
            
            if (files.length < 2) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Se requieren al menos 2 imágenes de entrada para la fusión' }));
              return;
            }
            
            // Directorios temporales y de salida
            const tempDir = path.resolve(__dirname, 'public/temp');
            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const savedPaths: string[] = [];
            for (let i = 0; i < files.length; i++) {
              const ext = path.extname(files[i].filename) || '.jpg';
              const tempPath = path.join(tempDir, `input_${i}_${Date.now()}${ext}`);
              fs.writeFileSync(tempPath, files[i].data);
              savedPaths.push(tempPath);
            }
            
            const sanitizedRoomName = targetRoom.toLowerCase()
              .replace(/[^a-z0-9]/g, '_')
              .replace(/_+/g, '_');
            const outputFilename = `${sanitizedRoomName}_360_${Date.now()}.webp`;
            
            const outputDir = path.resolve(__dirname, 'public/assets/inmuebles/propiedad-ejemplo/media');
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }
            const outputPath = path.join(outputDir, outputFilename);
            
            // Invocar script de Python de costura
            const pythonScript = path.resolve(__dirname, 'scripts/inmo_stitch.py');
            const cmd = `python "${pythonScript}" "${outputPath}" ${savedPaths.map(p => `"${p}"`).join(' ')}`;
            
            exec(cmd, (err, stdout, stderr) => {
              // Limpiar archivos temporales
              for (const p of savedPaths) {
                try { fs.unlinkSync(p); } catch (e) {}
              }
              
              if (err) {
                console.error('Error al ejecutar costura en Python:', stderr || stdout);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                  error: 'Error en la costura local. Asegúrate de tener Python y la librería opencv-python instalados.',
                  details: stderr || stdout || err.message
                }));
                return;
              }
              
              // Responder éxito con la ruta relativa del activo
              const relativePath = `assets/inmuebles/propiedad-ejemplo/media/${outputFilename}`;
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                success: true, 
                imagePath: relativePath 
              }));
            });
            
          } catch (err: any) {
            console.error('Error procesando multipart:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error del servidor procesando las imágenes', details: err.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/inmobiliaria-tours-virtuales-repunto/' : '/',
  plugins: [react(), localAiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
  },
});
