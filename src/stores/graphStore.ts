import { defineStore } from 'pinia';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface RoleAnalysis {
  skill: string;
  category: string;
  hasSkill: boolean;
  recommendedTechnologies: string[];
}

export const useGraphStore = defineStore('graph', {
  state: () => ({
    users: [] as User[],
    roles: [] as Role[],
    selectedUser: null as User | null,
    selectedRole: null as Role | null,
    userSkills: [] as Skill[],
    roleAnalysis: [] as RoleAnalysis[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchUsers() {
      try {
        const response = await api.get('/users');
        this.users = response.data.users;
        if (this.users.length > 0 && !this.selectedUser) {
          this.selectedUser = this.users[0];
          await this.fetchUserSkills();
        }
      } catch (err: any) {
        this.error = err.message;
      }
    },
    async fetchRoles() {
      try {
        const response = await api.get('/roles');
        this.roles = response.data.roles;
      } catch (err: any) {
        this.error = err.message;
      }
    },
    async fetchUserSkills() {
      if (!this.selectedUser) return;
      this.loading = true;
      try {
        const response = await api.get(`/users/${this.selectedUser.id}/skills`);
        this.userSkills = response.data.skills;
        if (this.selectedRole) {
          await this.fetchRoleAnalysis();
        }
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchRoleAnalysis() {
      if (!this.selectedUser || !this.selectedRole) return;
      this.loading = true;
      try {
        const response = await api.get(`/recommendations/role`, {
          params: { userId: this.selectedUser.id, roleId: this.selectedRole.id }
        });
        this.roleAnalysis = response.data.analysis;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    selectUser(user: User) {
      this.selectedUser = user;
      // Reset role selection and previous analysis so the UI stays consistent
      this.selectedRole = null;
      this.roleAnalysis = [];
      this.fetchUserSkills();
    },
    selectRole(role: Role) {
      this.selectedRole = role;
      this.fetchRoleAnalysis();
    }
  }
});
