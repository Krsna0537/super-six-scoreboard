// API Configuration
export const API_CONFIG = {
  sportmonks: {
    apiKey: 'your_free_sportmonks_api_key_here', // Replace this with your actual API key
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
