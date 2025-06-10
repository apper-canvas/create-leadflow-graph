import { delay } from '../index';
import teamMembersData from '../mockData/teamMembers.json';

class TeamMemberService {
  constructor() {
    this.teamMembers = [...teamMembersData];
  }

  async getAll() {
    await delay(200);
    return [...this.teamMembers];
  }

  async getById(id) {
    await delay(200);
    const member = this.teamMembers.find(m => m.id === id);
    if (!member) throw new Error('Team member not found');
    return { ...member };
  }

  async create(memberData) {
    await delay(300);
    const newMember = {
      id: Date.now().toString(),
      ...memberData
    };
    this.teamMembers.push(newMember);
    return { ...newMember };
  }

  async update(id, updateData) {
    await delay(250);
    const index = this.teamMembers.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Team member not found');
    
    this.teamMembers[index] = { ...this.teamMembers[index], ...updateData };
    return { ...this.teamMembers[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.teamMembers.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Team member not found');
    
    this.teamMembers.splice(index, 1);
    return true;
  }
}

export default new TeamMemberService();