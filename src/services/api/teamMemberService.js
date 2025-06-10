import { toast } from 'react-toastify';

class TeamMemberService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "email", "role"],
        orderBy: [{ fieldName: "Name", SortType: "ASC" }]
      };
      
      const response = await this.apperClient.fetchRecords('team_member', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return this.transformTeamMembersForUI(response.data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
      throw error;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "email", "role"]
      };
      
      const response = await this.apperClient.getRecordById('team_member', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return this.transformTeamMemberForUI(response.data);
    } catch (error) {
      console.error(`Error fetching team member with ID ${id}:`, error);
      toast.error("Failed to fetch team member details");
      throw error;
    }
  }

  async create(memberData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const transformedData = this.transformTeamMemberForDB(memberData);
      const params = {
        records: [transformedData]
      };
      
      const response = await this.apperClient.createRecord('team_member', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return this.transformTeamMemberForUI(successfulRecords[0].data);
        }
      }
      
      throw new Error('Failed to create team member');
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const transformedData = this.transformTeamMemberForDB(updateData);
      const params = {
        records: [{ Id: parseInt(id), ...transformedData }]
      };
      
      const response = await this.apperClient.updateRecord('team_member', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return this.transformTeamMemberForUI(successfulUpdates[0].data);
        }
      }
      
      throw new Error('Failed to update team member');
    } catch (error) {
      console.error("Error updating team member:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('team_member', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw error;
    }
  }

  // Transform database record to UI format
  transformTeamMemberForUI(dbRecord) {
    if (!dbRecord) return null;
    
    return {
      id: dbRecord.Id?.toString(),
      name: dbRecord.Name || '',
      email: dbRecord.email || '',
      role: dbRecord.role || '',
      tags: dbRecord.Tags || ''
    };
  }

  // Transform multiple team members for UI
  transformTeamMembersForUI(dbRecords) {
    return dbRecords.map(record => this.transformTeamMemberForUI(record));
  }

  // Transform UI data to database format (only Updateable fields)
  transformTeamMemberForDB(uiData) {
    const dbData = {};
    
    // Only include Updateable fields based on schema
    if (uiData.name !== undefined) dbData.Name = uiData.name;
    if (uiData.tags !== undefined) dbData.Tags = uiData.tags;
    if (uiData.email !== undefined) dbData.email = uiData.email;
    if (uiData.role !== undefined) dbData.role = uiData.role;
    
    return dbData;
  }
}

export default new TeamMemberService();