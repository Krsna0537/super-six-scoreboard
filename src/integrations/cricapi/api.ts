import axios from 'axios';

const CRICAPI_BASE_URL = 'https://cricapi.com/api';

export interface CricAPIConfig {
  apiKey: string;
}

export class CricAPI {
  private apiKey: string;
  private axiosInstance;

  constructor(config: CricAPIConfig) {
    this.apiKey = config.apiKey;
    this.axiosInstance = axios.create({
      baseURL: CRICAPI_BASE_URL,
      params: {
        apikey: this.apiKey
      }
    });
  }

  // Match endpoints
  async getLiveMatches() {
    try {
      // If API key is empty, return a placeholder response to avoid errors
      if (!this.apiKey) {
        console.log('CricAPI key is not configured. Returning mock data.');
        return { matches: [] };
      }

      const response = await this.axiosInstance.get('/matches');
      return response.data;
    } catch (error) {
      console.error('Error fetching live matches from CricAPI:', error);
      return { matches: [] }; // Return empty array instead of throwing to avoid breaking the UI
    }
  }

  async getMatchScore(matchId: string) {
    try {
      if (!this.apiKey) {
        console.log('CricAPI key is not configured. Returning mock data.');
        return { data: null };
      }

      const response = await this.axiosInstance.get('/cricketScore', {
        params: { unique_id: matchId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching match score:', error);
      return { data: null };
    }
  }

  async getPlayerStats(playerId: string) {
    try {
      if (!this.apiKey) {
        console.log('CricAPI key is not configured. Returning mock data.');
        return { data: null };
      }

      const response = await this.axiosInstance.get('/playerStats', {
        params: { pid: playerId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return { data: null };
    }
  }
  
  async getUpcomingMatches() {
    try {
      if (!this.apiKey) {
        console.log('CricAPI key is not configured. Returning mock data.');
        return { matches: [] };
      }

      const response = await this.axiosInstance.get('/matches');
      // Filter for upcoming matches
      const matches = response.data.matches?.filter((match: any) => 
        !match.matchStarted
      ) || [];
      return { matches };
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      return { matches: [] };
    }
  }
  
  async getCompletedMatches() {
    try {
      if (!this.apiKey) {
        console.log('CricAPI key is not configured. Returning mock data.');
        return { matches: [] };
      }

      const response = await this.axiosInstance.get('/matches');
      // Filter for completed matches
      const matches = response.data.matches?.filter((match: any) => 
        match.matchStarted && match.matchCompleted
      ) || [];
      return { matches };
    } catch (error) {
      console.error('Error fetching completed matches:', error);
      return { matches: [] };
    }
  }
}
