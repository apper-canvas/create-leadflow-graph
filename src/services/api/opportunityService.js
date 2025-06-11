// ApperClient service for opportunities
import { toast } from 'react-toastify';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OpportunityService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'opportunity';
  }

  async getAll(filters = {}) {
    try {
      // Define fields for opportunity table
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'Stage', 'Amount', 'CloseDate', 'LeadSource', 'Description'
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
      if (filters.stage) {
        params.where.push({
          fieldName: "Stage",
          operator: "ExactMatch",
          values: [filters.stage]
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
                    fieldName: "Description",
                    operator: "Contains",
                    values: [filters.search]
                  },
                  {
                    fieldName: "LeadSource",
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
      console.error("Error fetching opportunities:", error);
      toast.error("Failed to fetch opportunities");
      return { data: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  async getById(id) {
    try {
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'Stage', 'Amount', 'CloseDate', 'LeadSource', 'Description'
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
      console.error(`Error fetching opportunity with ID ${id}:`, error);
      toast.error("Failed to fetch opportunity");
      return null;
    }
  }

  async create(opportunityData) {
    try {
      // Only include updateable fields for create operation
      const updateableFields = {
        Name: opportunityData.Name,
        Tags: opportunityData.Tags,
        Owner: opportunityData.Owner,
        Stage: opportunityData.Stage || 'Prospecting',
        Amount: opportunityData.Amount,
        CloseDate: opportunityData.CloseDate,
        LeadSource: opportunityData.LeadSource,
        Description: opportunityData.Description
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
          toast.success("Opportunity created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating opportunity:", error);
      toast.error("Failed to create opportunity");
      return null;
    }
  }

  async update(id, opportunityData) {
    try {
      // Only include updateable fields for update operation
      const updateableFields = {
        Id: parseInt(id),
        ...opportunityData
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
          toast.success("Opportunity updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating opportunity:", error);
      toast.error("Failed to update opportunity");
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
          toast.success("Opportunity deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      toast.error("Failed to delete opportunity");
      return false;
    }
  }

  async getDashboardMetrics() {
    try {
      await delay(200);
      
      const allOpportunities = await this.getAll({ limit: 1000 });
      const opportunities = allOpportunities.data;
      
      const totalRevenue = opportunities
        .filter(opp => opp.Stage === 'Closed Won')
        .reduce((sum, opp) => sum + (opp.Amount || 0), 0);
      
      const pipelineValue = opportunities
        .filter(opp => !['Closed Won', 'Closed Lost'].includes(opp.Stage))
        .reduce((sum, opp) => sum + (opp.Amount || 0), 0);
      
      return {
        total: opportunities.length,
        totalRevenue,
        pipelineValue,
        averageDealSize: opportunities.length > 0 ? Math.round(totalRevenue / opportunities.length) : 0
      };
    } catch (error) {
      console.error("Error fetching opportunity metrics:", error);
      return {
        total: 0,
        totalRevenue: 0,
        pipelineValue: 0,
        averageDealSize: 0
      };
    }
  }
}

export default new OpportunityService();