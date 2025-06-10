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
      .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
  }
}

export default new LeadService();