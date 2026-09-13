import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de comprobación del servicio
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'tfg-incendios-backend'
  });
});

app.listen(PORT, () => {
  console.log(`⚡ Servidor backend corriendo en http://localhost:${PORT}`);
});
