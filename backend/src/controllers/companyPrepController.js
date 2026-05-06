const openRouterService = require('../services/openRouterService');
const {
  buildCompanyPrepDetail,
  buildCompanyPrepSummaries,
} = require('../utils/frontendData');

const companyPrepController = {
  async getCompanies(req, res) {
    try {
      res.json({
        companies: buildCompanyPrepSummaries(),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getCompanyDetail(req, res) {
    try {
      const company = buildCompanyPrepDetail(req.params.companyId);
      const insights = await openRouterService.generateCompanyInsights(company.name, req.query.role || 'Senior Software Engineer');

      res.json({
        ...company,
        insights,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = companyPrepController;
