
import { emergencyService as userEmergencyService } from './user/emergencyService';

export const emergencyService = {
  getAll: async () => {
    return userEmergencyService.getAll();
  },

  getContacts: async () => {
    return userEmergencyService.getContacts();
  },

  createContact: async (contact) => {
    return userEmergencyService.createContact(contact);
  },

  updateContact: async (id, contact) => {
    return userEmergencyService.updateContact(id, contact);
  },

  deleteContact: async (id) => {
    return userEmergencyService.deleteContact(id);
  },

  getSosEvents: async () => {
    return userEmergencyService.getSosEvents();
  },

  createSosEvent: async (event) => {
    return userEmergencyService.createSosEvent(event);
  },

  updateSosEvent: async (id, event) => {
    return userEmergencyService.updateSosEvent(id, event);
  },
};
