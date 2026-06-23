const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const roadmapRoutes = require('./routes/roadmap');
const interviewRoutes = require('./routes/interview');
const analyticsRoutes = require('./routes/analytics');
const dashboardRoutes = require('./routes/dashboard');
const companyPrepRoutes = require('./routes/companyPrep');







const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || 'public/uploads')));


app.get('/', (req, res) => res.json({ message: 'PlacifAI API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/company-prep', companyPrepRoutes);




const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✓ Database synced');
    app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error:', err));