const axios = require('axios');

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_MAPPING = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  cpp: { language: 'cpp', version: '10.2.0' },
  java: { language: 'java', version: '17.0.2' }
};

const pistonService = {
  async execute(language, code, stdin = '') {
    const config = LANGUAGE_MAPPING[language.toLowerCase()];
    if (!config) throw new Error(`Unsupported language: ${language}`);

    const payload = {
      language: config.language,
      version: config.version,
      files: [
        {
          content: code
        }
      ],
      stdin: stdin,
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    };

    try {
      const response = await axios.post(PISTON_URL, payload);
      return response.data;
    } catch (error) {
      console.error('Piston Execution Error:', error.response?.data || error.message);
      throw new Error('Failed to execute code');
    }
  }
};

module.exports = pistonService;
