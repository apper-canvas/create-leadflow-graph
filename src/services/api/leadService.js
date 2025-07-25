// ApperClient service for leads
import { toast } from 'react-toastify';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LeadService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'lead';
  }

  async getAll(filters = {}) {
    try {
      // Define updateable fields for lead table
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'email', 'phone', 'company', 'lead_source', 'status', 'assigned_to', 'notes',
        'created_at', 'updated_at', 'follow_up_date'
      ];

      const params = {
        fields: fields,
        where: [],
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ],
        pagingInfo: {
          limit: filters.limit || 20,
          offset: ((filters.page || 1) - 1) * (filters.limit || 20)
        }
      };

      // Apply filters
      if (filters.status) {
        params.where.push({
          fieldName: "status",
          operator: "ExactMatch",
          values: [filters.status]
        });
      }

      if (filters.search) {
        params.whereGroups = [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [filters.search]
                  },
                  {
                    fieldName: "email",
                    operator: "Contains",
                    values: [filters.search]
                  },
                  {
                    fieldName: "company",
                    operator: "Contains",
                    values: [filters.search]
                  }
                ],
                operator: ""
              }
            ]
          }
        ];
      }

      if (filters.assigned_to) {
        params.where.push({
          fieldName: "assigned_to",
          operator: "ExactMatch",
          values: [filters.assigned_to]
        });
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { data: [], total: 0, page: 1, totalPages: 0 };
      }

      return {
        data: response.data || [],
        total: response.totalRecords || 0,
        page: filters.page || 1,
        totalPages: Math.ceil((response.totalRecords || 0) / (filters.limit || 20))
      };
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
      return { data: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  async getById(id) {
    try {
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'email', 'phone', 'company', 'lead_source', 'status', 'assigned_to', 'notes',
        'created_at', 'updated_at', 'follow_up_date'
      ];

      const params = { fields };
      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching lead with ID ${id}:`, error);
      toast.error("Failed to fetch lead");
      return null;
    }
  }

  async create(leadData) {
    try {
      // Only include updateable fields for create operation
      const updateableFields = {
        Name: leadData.Name,
        Tags: leadData.Tags,
        Owner: leadData.Owner,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        lead_source: leadData.lead_source,
        status: leadData.status || 'New',
        assigned_to: leadData.assigned_to,
        notes: leadData.notes,
        follow_up_date: leadData.follow_up_date
      };

      // Remove undefined fields
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === undefined) {
          delete updateableFields[key];
        }
      });

      const params = {
        records: [updateableFields]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
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
          toast.success("Lead created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead");
      return null;
    }
  }

  async update(id, leadData) {
    try {
      // Only include updateable fields for update operation
      const updateableFields = {
        Id: parseInt(id),
        ...leadData
      };

      // Remove system and readonly fields
      delete updateableFields.CreatedOn;
      delete updateableFields.CreatedBy;
      delete updateableFields.ModifiedOn;
      delete updateableFields.ModifiedBy;

      // Remove undefined fields
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === undefined) {
          delete updateableFields[key];
        }
      });

      const params = {
        records: [updateableFields]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
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
          toast.success("Lead updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

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

        if (successfulDeletions.length > 0) {
          toast.success("Lead deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
      return false;
    }
  }

  async getByStatus(status) {
    try {
      const filters = { status };
      const result = await this.getAll(filters);
      return result.data;
    } catch (error) {
      console.error("Error fetching leads by status:", error);
      return [];
    }
  }

  async updateStatus(id, status) {
    try {
      return await this.update(id, { status });
    } catch (error) {
      console.error("Error updating lead status:", error);
      return null;
    }
  }

  // Get leads for dashboard metrics
  async getDashboardMetrics() {
    try {
      await delay(200);
      
      const allLeads = await this.getAll({ limit: 1000 });
      const leads = allLeads.data;
      
      const total = leads.length;
      const newLeads = leads.filter(lead => lead.status === 'New').length;
      const qualified = leads.filter(lead => lead.status === 'Qualified').length;
      const won = leads.filter(lead => lead.status === 'Won').length;
      
      return {
        total,
        new: newLeads,
        qualified,
        won,
        conversionRate: total > 0 ? Math.round((won / total) * 100) : 0
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      return {
        total: 0,
        new: 0,
        qualified: 0,
        won: 0,
        conversionRate: 0
      };
    }
  }

  // Get leads with upcoming follow-ups
  async getUpcomingFollowUps() {
    try {
      await delay(200);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      const allLeads = await this.getAll({ limit: 1000 });
      const leads = allLeads.data;
      
      return leads.filter(lead => {
        if (!lead.follow_up_date) return false;
        const followUpDate = new Date(lead.follow_up_date);
        return followUpDate >= today && followUpDate <= nextWeek;
      });
    } catch (error) {
      console.error("Error fetching upcoming follow-ups:", error);
      return [];
    }
}
}

export default new LeadService();