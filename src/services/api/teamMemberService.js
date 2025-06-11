// ApperClient service for team members
import { toast } from 'react-toastify';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TeamMemberService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'team_member';
  }

  async getAll(filters = {}) {
    try {
      // Define fields for team_member table
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'email', 'role'
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
      if (filters.role) {
        params.where.push({
          fieldName: "role",
          operator: "ExactMatch",
          values: [filters.role]
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
                    fieldName: "role",
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
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
      return { data: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  async getById(id) {
    try {
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'email', 'role'
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
      console.error(`Error fetching team member with ID ${id}:`, error);
      toast.error("Failed to fetch team member");
      return null;
    }
  }

  async create(memberData) {
    try {
      // Only include updateable fields for create operation
      const updateableFields = {
        Name: memberData.Name,
        Tags: memberData.Tags,
        Owner: memberData.Owner,
        email: memberData.email,
        role: memberData.role
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
          toast.success("Team member created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating team member:", error);
      toast.error("Failed to create team member");
      return null;
    }
  }

  async update(id, memberData) {
    try {
      // Only include updateable fields for update operation
      const updateableFields = {
        Id: parseInt(id),
        ...memberData
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
          toast.success("Team member updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member");
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
          toast.success("Team member deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
      return false;
    }
  }

  // Get team members for dashboard metrics
  async getTeamStats() {
    try {
      await delay(200);
      
      const allMembers = await this.getAll({ limit: 1000 });
      const members = allMembers.data;
      
      const total = members.length;
      
      return {
        total,
        activeMembers: total // All fetched members are considered active
      };
    } catch (error) {
      console.error("Error fetching team stats:", error);
      return {
        total: 0,
        activeMembers: 0
      };
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
    if (!dbRecords || !Array.isArray(dbRecords)) return [];
    return dbRecords.map(record => this.transformTeamMemberForUI(record));
  }

  // Transform UI data to database format (only Updateable fields)
  transformTeamMemberForDB(uiData) {
    if (!uiData) return {};
    
    const dbData = {};
    
    // Only include Updateable fields based on schema
    if (uiData.name !== undefined) dbData.Name = uiData.name;
    if (uiData.tags !== undefined) dbData.Tags = uiData.tags;
    if (uiData.email !== undefined) dbData.email = uiData.email;
    if (uiData.role !== undefined) dbData.role = uiData.role;
    
    return dbData;
  }

  // Initialize client if not already done
  initializeClient() {
    if (!this.apperClient && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }
}

export default new TeamMemberService();