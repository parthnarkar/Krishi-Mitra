const API_BASE_URL = 'http://localhost:3001/api';

export const negotiationService = {
  // Submit a new negotiation
  submitNegotiation: async (negotiationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/negotiations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(negotiationData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit negotiation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in submitNegotiation:', error);
      throw error;
    }
  },

  // Get negotiation history
  getNegotiationHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/negotiations/history`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch negotiation history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getNegotiationHistory:', error);
      throw error;
    }
  },

  // Get negotiation status
  getNegotiationStatus: async (negotiationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/negotiations/${negotiationId}/status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch negotiation status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getNegotiationStatus:', error);
      throw error;
    }
  },
}; 