import { useState, useCallback } from 'react';
import { negotiationService } from '../../api/negotiationService';

export const useNegotiation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [negotiationStatus, setNegotiationStatus] = useState(null);

  const submitNegotiation = useCallback(async (negotiationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await negotiationService.submitNegotiation(negotiationData);
      setNegotiationStatus(response.status);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkNegotiationStatus = useCallback(async (negotiationId) => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await negotiationService.getNegotiationStatus(negotiationId);
      setNegotiationStatus(status);
      return status;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const history = await negotiationService.getNegotiationHistory();
      return history;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    negotiationStatus,
    submitNegotiation,
    checkNegotiationStatus,
    getHistory,
  };
}; 