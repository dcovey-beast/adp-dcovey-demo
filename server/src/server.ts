import express from 'express';
import cors from 'cors';
import path from 'path';
import salesforceRoutes from './routes/salesforce';
import addeparRoutes from './routes/addepar';
import mappingsRoutes from './routes/mappings';
import syncRoutes from './routes/sync';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app (for production)
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

// Routes
app.use('/api/salesforce', salesforceRoutes);
app.use('/api/addepar', addeparRoutes);
app.use('/api/mappings', mappingsRoutes);
app.use('/api/sync', syncRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for any other route (for production)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
app.listen(PORT, host, () => {
  console.log(`🚀 Mock MuleSoft backend running on http://localhost:${PORT}`);
});
