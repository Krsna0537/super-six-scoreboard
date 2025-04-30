import { useMemo } from 'react';
import { SportMonksAPI } from '../integrations/sportmonks/api';
import { CricAPI } from '../integrations/cricapi/api';
import { API_CONFIG } from '../config/api';

export const useCricketAPI = () => {
  const sportmonksAPI = useMemo(() => {
    return new SportMonksAPI({
      apiKey: API_CONFIG.sportmonks.apiKey,
    });
  }, []);

  const cricAPI = useMemo(() => {
    return new CricAPI({
      apiKey: API_CONFIG.cricapi.apiKey,
    });
  }, []);

  return {
    sportmonks: {
      getLiveMatches: sportmonksAPI.getLiveMatches.bind(sportmonksAPI),
      getMatchDetails: sportmonksAPI.getMatchDetails.bind(sportmonksAPI),
      getMatchScorecard: sportmonksAPI.getMatchScorecard.bind(sportmonksAPI),
    },
    cricapi: {
      getLiveMatches: cricAPI.getLiveMatches.bind(cricAPI),
      getMatchScore: cricAPI.getMatchScore.bind(cricAPI),
      getPlayerStats: cricAPI.getPlayerStats.bind(cricAPI),
    },
  };
}; 