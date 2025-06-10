import { delay } from '../index';
import leadService from './leadService';

class DashboardService {
  async getMetrics() {
    await delay(400);
    
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
  }

  async getRecentActivity() {
    await delay(300);
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
  }
}

export default new DashboardService();