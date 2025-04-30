// API Configuration
export const API_CONFIG = {
  sportmonks: {
    apiKey: import.meta.env.VITE_SPORTMONKS_API_KEY || '',
  },
  cricapi: {
    apiKey: import.meta.env.VITE_CRICAPI_API_KEY || '',
  },
};

// API Endpoints
export const ENDPOINTS = {
  sportmonks: {
    baseUrl: 'https://api.sportmonks.com/v3',
    endpoints: {
      liveMatches: '/cricket/matches/live',
      matchDetails: '/cricket/matches',
      scorecard: '/cricket/matches/{matchId}/scorecard',
    },
  },
  cricapi: {
    baseUrl: 'https://cricapi.com/api',
    endpoints: {
      matches: '/matches',
      cricketScore: '/cricketScore',
      playerStats: '/playerStats',
    },
  },
}; 