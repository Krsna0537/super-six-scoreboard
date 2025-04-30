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
        apikey: this.apiKey,
      },
    });
  }

  // Cricket matches endpoints
  async getLiveMatches() {
    try {
      const response = await this.axiosInstance.get('/matches');
      return response.data;
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  }

  async getMatchScore(matchId: string) {
    try {
      const response = await this.axiosInstance.get('/cricketScore', {
        params: { unique_id: matchId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching match score:', error);
      throw error;
    }
  }

  async getPlayerStats(playerId: string) {
    try {
      const response = await this.axiosInstance.get('/playerStats', {
        params: { pid: playerId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  }

  async getUpcomingMatches() {
    try {
      const response = await this.axiosInstance.get('/matches');
      // Filter for matches that have not started yet
      const upcoming = (response.data.matches || []).filter((match: any) => match.matchStarted === false);
      return { ...response.data, matches: upcoming };
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      throw error;
    }
  }

  async getCompletedMatches() {
    try {
      const response = await this.axiosInstance.get('/matches');
      // Filter for matches that have started and have a result
      const completed = (response.data.matches || []).filter((match: any) => match.matchStarted === true && match['winner_team']);
      return { ...response.data, matches: completed };
    } catch (error) {
      console.error('Error fetching completed matches:', error);
      throw error;
    }
  }
} 