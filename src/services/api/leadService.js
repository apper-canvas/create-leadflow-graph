import { toast } from 'react-toastify';

class LeadService {
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
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", 
                "email", "phone", "company", "lead_source", "status", "assigned_to", "notes", 
                "created_at", "updated_at", "follow_up_date"],
        orderBy: [{ fieldName: "created_at", SortType: "DESC" }]
      };
      
      const response = await this.apperClient.fetchRecords('lead', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return this.transformLeadsForUI(response.data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
      throw error;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: ["Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", 
                "email", "phone", "company", "lead_source", "status", "assigned_to", "notes", 
                "created_at", "updated_at", "follow_up_date"]
      };
      
      const response = await this.apperClient.getRecordById('lead', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return this.transformLeadForUI(response.data);
    } catch (error) {
      console.error(`Error fetching lead with ID ${id}:`, error);
      toast.error("Failed to fetch lead details");
      throw error;
    }
  }

  async create(leadData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const transformedData = this.transformLeadForDB(leadData);
      const params = {
        records: [transformedData]
      };
      
      const response = await this.apperClient.createRecord('lead', params);
      
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
          return this.transformLeadForUI(successfulRecords[0].data);
        }
      }
      
      throw new Error('Failed to create lead');
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const transformedData = this.transformLeadForDB(updateData);
      const params = {
        records: [{ Id: parseInt(id), ...transformedData }]
      };
      
      const response = await this.apperClient.updateRecord('lead', params);
      
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
          return this.transformLeadForUI(successfulUpdates[0].data);
        }
      }
      
      throw new Error('Failed to update lead');
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('lead', params);
      
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
      console.error("Error deleting lead:", error);
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const allLeads = await this.getAll();
      return allLeads.filter(lead => lead.status === status);
    } catch (error) {
      console.error("Error fetching leads by status:", error);
      throw error;
    }
  }

  async getUpcomingFollowUps() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const params = {
        fields: ["Name", "email", "company", "status", "assigned_to", "follow_up_date"],
        where: [
          {
            fieldName: "follow_up_date",
            operator: "LessThanOrEqualTo",
            values: [nextWeek.toISOString()]
          },
          {
            fieldName: "follow_up_date",
            operator: "HasValue",
            values: []
          }
        ],
        orderBy: [{ fieldName: "follow_up_date", SortType: "ASC" }]
      };
      
      const response = await this.apperClient.fetchRecords('lead', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return this.transformLeadsForUI(response.data || []);
    } catch (error) {
      console.error("Error fetching upcoming follow-ups:", error);
      return [];
    }
  }

  // Transform database record to UI format
  transformLeadForUI(dbRecord) {
    if (!dbRecord) return null;
    
    return {
      id: dbRecord.Id?.toString(),
      name: dbRecord.Name || '',
      email: dbRecord.email || '',
      phone: dbRecord.phone || '',
      company: dbRecord.company || '',
      leadSource: dbRecord.lead_source || '',
      status: dbRecord.status || 'New',
      assignedTo: dbRecord.assigned_to ? dbRecord.assigned_to.toString() : null,
      notes: dbRecord.notes || '',
      createdAt: dbRecord.created_at || dbRecord.CreatedOn || new Date().toISOString(),
      updatedAt: dbRecord.updated_at || dbRecord.ModifiedOn || new Date().toISOString(),
      followUpDate: dbRecord.follow_up_date || null,
      tags: dbRecord.Tags || ''
    };
  }

  // Transform multiple leads for UI
  transformLeadsForUI(dbRecords) {
    return dbRecords.map(record => this.transformLeadForUI(record));
  }

  // Transform UI data to database format (only Updateable fields)
  transformLeadForDB(uiData) {
    const dbData = {};
    
    // Only include Updateable fields based on schema
    if (uiData.name !== undefined) dbData.Name = uiData.name;
    if (uiData.tags !== undefined) dbData.Tags = uiData.tags;
    if (uiData.email !== undefined) dbData.email = uiData.email;
    if (uiData.phone !== undefined) dbData.phone = uiData.phone;
    if (uiData.company !== undefined) dbData.company = uiData.company;
    if (uiData.leadSource !== undefined) dbData.lead_source = uiData.leadSource;
    if (uiData.status !== undefined) dbData.status = uiData.status;
    if (uiData.assignedTo !== undefined) dbData.assigned_to = uiData.assignedTo ? parseInt(uiData.assignedTo) : null;
    if (uiData.notes !== undefined) dbData.notes = uiData.notes;
    if (uiData.createdAt !== undefined) dbData.created_at = uiData.createdAt;
    if (uiData.updatedAt !== undefined) dbData.updated_at = uiData.updatedAt;
    if (uiData.followUpDate !== undefined) dbData.follow_up_date = uiData.followUpDate;
    
    return dbData;
  }

  async getLeadTimeline(id) {
    // This would require a separate timeline/activity table
    // For now, return empty array as this feature would need additional database design
    return [];
  }

  async addTimelineEvent(leadId, eventData) {
    // This would require a separate timeline/activity table
    // For now, return the event data as this feature would need additional database design
    return {
      id: Date.now().toString(),
      leadId,
      timestamp: new Date().toISOString(),
      ...eventData
    };
  }
}

export default new LeadService();