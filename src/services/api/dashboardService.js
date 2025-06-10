import leadService from './leadService';

class DashboardService {
  async getMetrics() {
    try {
      const leads = await leadService.getAll();
      const upcomingFollowUps = await leadService.getUpcomingFollowUps();
      
      const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});

      const totalLeads = leads.length;
      const wonLeads = leadsByStatus['Won'] || 0;
      const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

      return {
        totalLeads,
        leadsByStatus,
        conversionRate: Math.round(conversionRate * 100) / 100,
        upcomingFollowUps: upcomingFollowUps.slice(0, 5)
      };
    } catch (error) {
      console.error("Error calculating dashboard metrics:", error);
      throw error;
    }
  }

  async getRecentActivity() {
    try {
      const leads = await leadService.getAll();
      
      return leads
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 10)
        .map(lead => ({
          id: lead.id,
          type: 'status_change',
          leadName: lead.name,
          status: lead.status,
          timestamp: lead.updatedAt
        }));
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  }
}

export default new DashboardService();