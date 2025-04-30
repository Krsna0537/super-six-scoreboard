import axios from 'axios';

const SPORTMONKS_BASE_URL = 'https://api.sportmonks.com/v3';

export interface SportMonksConfig {
  apiKey: string;
}

export class SportMonksAPI {
  private apiKey: string;
  private axiosInstance;

  constructor(config: SportMonksConfig) {
    this.apiKey = config.apiKey;
    this.axiosInstance = axios.create({
      baseURL: SPORTMONKS_BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
      },
    });
  }

  // Cricket matches endpoints
  async getLiveMatches() {
    try {
      const response = await this.axiosInstance.get('/cricket/matches/live');
      return response.data;
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  }

  async getMatchDetails(matchId: string) {
    try {
      const response = await this.axiosInstance.get(`/cricket/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw error;
    }
  }

  async getMatchScorecard(matchId: string) {
    try {
      const response = await this.axiosInstance.get(`/cricket/matches/${matchId}/scorecard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match scorecard:', error);
      throw error;
    }
  }

  async getUpcomingMatches() {
    try {
      const response = await this.axiosInstance.get('/cricket/matches/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      throw error;
    }
  }

  async getCompletedMatches() {
    try {
      const response = await this.axiosInstance.get('/cricket/matches/finished');
      return response.data;
    } catch (error) {
      console.error('Error fetching completed matches:', error);
      throw error;
    }
  }
} 