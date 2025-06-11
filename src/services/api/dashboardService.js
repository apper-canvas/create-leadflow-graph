// ApperClient service for dashboard data
import leadService from './leadService';
import teamMemberService from './teamMemberService';
import opportunityService from './opportunityService';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DashboardService {
  async getDashboardData() {
    await delay(400);
    
    try {
      // Get data from various services
      const [
        leadMetrics,
        teamStats,
        upcomingFollowUps,
        opportunityMetrics
      ] = await Promise.all([
        leadService.getDashboardMetrics(),
        teamMemberService.getTeamStats(),
        leadService.getUpcomingFollowUps(),
        opportunityService.getDashboardMetrics()
      ]);

      // Calculate additional metrics
      const totalActivities = upcomingFollowUps.length;
      const recentActivity = {
        newLeads: leadMetrics.new,
        closedDeals: leadMetrics.won,
        scheduledFollowUps: totalActivities,
        totalRevenue: opportunityMetrics.totalRevenue
      };

      return {
        overview: {
          totalLeads: leadMetrics.total,
          newLeads: leadMetrics.new,
          qualifiedLeads: leadMetrics.qualified,
          wonDeals: leadMetrics.won,
          conversionRate: leadMetrics.conversionRate,
          teamMembers: teamStats.total,
          activeMembers: teamStats.activeMembers,
          totalOpportunities: opportunityMetrics.total,
          totalRevenue: opportunityMetrics.totalRevenue,
          pipelineValue: opportunityMetrics.pipelineValue
        },
        recentActivity,
        upcomingFollowUps,
        chartData: {
          leadsByStatus: [
            { status: 'New', count: leadMetrics.new, color: '#3B82F6' },
            { status: 'Contacted', count: Math.floor(leadMetrics.total * 0.2), color: '#F59E0B' },
            { status: 'Qualified', count: leadMetrics.qualified, color: '#10B981' },
            { status: 'Won', count: leadMetrics.won, color: '#059669' },
            { status: 'Lost', count: Math.floor(leadMetrics.total * 0.1), color: '#EF4444' }
          ],
          monthlyTrends: [
            { month: 'Jan', leads: 45, deals: 12 },
            { month: 'Feb', leads: 52, deals: 18 },
            { month: 'Mar', leads: 48, deals: 15 },
            { month: 'Apr', leads: 61, deals: 22 },
            { month: 'May', leads: 55, deals: 19 },
            { month: 'Jun', leads: 67, deals: 25 }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async getMetricsOverview() {
    await delay(200);
    
    try {
      const [leadMetrics, teamStats, opportunityMetrics] = await Promise.all([
        leadService.getDashboardMetrics(),
        teamMemberService.getTeamStats(),
        opportunityService.getDashboardMetrics()
      ]);

      return {
        totalLeads: leadMetrics.total,
        newLeads: leadMetrics.new,
        conversionRate: leadMetrics.conversionRate,
        teamSize: teamStats.total,
        totalRevenue: opportunityMetrics.totalRevenue,
        pipelineValue: opportunityMetrics.pipelineValue,
        averageDealSize: opportunityMetrics.averageDealSize
      };
    } catch (error) {
      console.error('Error fetching metrics overview:', error);
      throw error;
    }
  }
}

export default new DashboardService();