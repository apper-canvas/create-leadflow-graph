import { delay } from '../index';
import leadsData from '../mockData/leads.json';

class LeadService {
  constructor() {
    this.leads = [...leadsData];
  }

  async getAll() {
    await delay(300);
    return [...this.leads];
  }

  async getById(id) {
    await delay(200);
    const lead = this.leads.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');
    return { ...lead };
  }

  async create(leadData) {
    await delay(400);
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.leads.unshift(newLead);
    return { ...newLead };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    
    this.leads[index] = {
      ...this.leads[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.leads[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    
    this.leads.splice(index, 1);
    return true;
  }

  async getByStatus(status) {
    await delay(200);
    return this.leads.filter(lead => lead.status === status);
  }

  async getUpcomingFollowUps() {
    await delay(200);
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.leads
      .filter(lead => lead.followUpDate && new Date(lead.followUpDate) <= nextWeek)
.filter(lead => lead.followUpDate && new Date(lead.followUpDate) <= nextWeek)
      .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
  }

  async getLeadTimeline(id) {
    await delay(300);
    const lead = this.leads.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');
    
    // Generate timeline events for the lead
    // In a real app, this would come from a separate timeline/activity table
    return [
      {
        id: '1',
        leadId: id,
        type: 'status_change',
        fromStatus: null,
        toStatus: 'new',
        timestamp: lead.createdAt,
        userId: 'user1',
        notes: 'Lead created from website contact form',
        metadata: { source: lead.leadSource }
      },
      {
        id: '2',
        leadId: id,
        type: 'assignment',
        assignedTo: lead.assignedTo,
        timestamp: new Date(new Date(lead.createdAt).getTime() + 60 * 60 * 1000).toISOString(),
        userId: 'user1',
        notes: `Assigned to ${lead.assignedTo ? 'sales team' : 'unassigned'} for initial contact`
      },
      {
        id: '3',
        leadId: id,
        type: 'status_change',
        fromStatus: 'new',
        toStatus: lead.status,
        timestamp: lead.updatedAt,
        userId: lead.assignedTo || 'user1',
        notes: `Status updated to ${lead.status}`,
        metadata: { previousStatus: 'new' }
      }
    ].filter(event => event.fromStatus !== event.toStatus);
  }

  async addTimelineEvent(leadId, eventData) {
    await delay(200);
    const lead = this.leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    
    // In a real app, this would save to a timeline/activity table
    const timelineEvent = {
      id: Date.now().toString(),
      leadId,
      timestamp: new Date().toISOString(),
      ...eventData
    };
    
    // For mock purposes, we'll just return the event
    // In reality, this would be stored separately from the lead
    return timelineEvent;
  }
}

export default new LeadService();