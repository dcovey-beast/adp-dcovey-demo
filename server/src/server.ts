import express from 'express';
import cors from 'cors';
import salesforceRoutes from './routes/salesforce';
import addeparRoutes from './routes/addepar';
import mappingsRoutes from './routes/mappings';
import syncRoutes from './routes/sync';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/salesforce', salesforceRoutes);
app.use('/api/addepar', addeparRoutes);
app.use('/api/mappings', mappingsRoutes);
app.use('/api/sync', syncRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Mock MuleSoft backend running on http://localhost:${PORT}`);
});
