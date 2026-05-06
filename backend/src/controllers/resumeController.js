const Resume = require('../models/Resume');
const openRouterService = require('../services/openRouterService');
const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const resumeController = {
  async uploadResume(req, res) {
    console.log('--- Upload Resume Started ---');
    try {
      if (!req.file) {
        console.log('Error: No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('File received:', req.file.originalname, 'Size:', req.file.size);
      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      
      let fileText = '';
      try {
        const buffer = await fs.readFile(filePath);
        
        if (fileExt === '.pdf') {
          const data = await pdf(buffer);
          fileText = data.text;
        } else if (fileExt === '.docx' || fileExt === '.doc') {
          const result = await mammoth.extractRawText({ buffer });
          fileText = result.value;
        } else {
          // Default to text
          fileText = buffer.toString('utf-8');
        }

        fileText = fileText.slice(0, 15000); // Take more chars for better analysis
        console.log('File read successfully, length:', fileText.length);
      } catch (err) {
        console.error('Error reading file:', err);
        fileText = `Extracted text from ${req.file.originalname}`;
      }

      console.log('Creating Resume record for user:', req.userId);
      const resume = await Resume.create({
        userId: req.userId,
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        rawText: fileText,
      });

      console.log('Resume created with ID:', resume.id);

      // Async analysis
      analyzeResumeAsync(resume.id, fileText).catch(err => console.error('Async analysis trigger error:', err));

      res.json({ 
        message: 'Resume uploaded successfully', 
        resumeId: resume.id 
      });
    } catch (error) {
      console.error('Upload Controller Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async analyzeResume(req, res) {
    console.log('--- Analyze Resume Started ---', req.params.resumeId);
    try {
      const { resumeId } = req.params;

      const resume = await Resume.findByPk(resumeId);
      if (!resume || resume.userId !== req.userId) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      if (resume.analysis) {
        console.log('Returning existing analysis');
        return res.json(resume.analysis);
      }

      console.log('Calling OpenRouter for analysis...');
      const analysis = await openRouterService.analyzeResume(resume.rawText);

      let score = analysis.score;
      if (!score) {
        const { buildResumeAnalysisFallback } = require('../utils/frontendData');
        const fallback = buildResumeAnalysisFallback(resume.rawText);
        score = fallback.score;
      }

      await resume.update({
        analysis,
        score,
        feedback: analysis,
      });

      console.log('Analysis complete and saved');
      res.json(analysis);
    } catch (error) {
      console.error('Analyze Controller Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getResumes(req, res) {
    try {
      const resumes = await Resume.findAll({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']],
      });

      res.json(resumes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async getResumeById(req, res) {
    try {
      const { resumeId } = req.params;
      const resume = await Resume.findOne({
        where: { id: resumeId, userId: req.userId }
      });
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }
      res.json(resume);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteResume(req, res) {
    try {
      const { resumeId } = req.params;
      const resume = await Resume.findOne({
        where: { id: resumeId, userId: req.userId }
      });
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }
      await resume.destroy();
      res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

async function analyzeResumeAsync(resumeId, resumeText) {
  try {
    console.log('Background analysis started for:', resumeId);
    const analysis = await openRouterService.analyzeResume(resumeText);
    const resume = await Resume.findByPk(resumeId);
    if(resume) {
      await resume.update({
        analysis,
        score: analysis.score || (analysis.strengths ? 0 : 70), // Use fallback logic
      });
      
      // If score is still 0 but analysis exists, recalculate from fallback
      if (resume.score === 0) {
        const { buildResumeAnalysisFallback } = require('../utils/frontendData');
        const fallback = buildResumeAnalysisFallback(resumeText);
        await resume.update({ score: analysis.score || fallback.score });
      }
      
      console.log('Background analysis finished and saved for:', resumeId);
    }
  } catch (error) {
    console.error('Resume background analysis error:', error);
  }
}

module.exports = resumeController;