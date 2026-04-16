import { Offer } from '../types/offer.type.js';
import got from 'got';

export class MockDataFetcher {
  constructor(private readonly url: string) {}

  public async fetchOffers(): Promise<Offer[]> {
    try {
      const response: any = await got(`${this.url}/offers`);

      let data;
      try {
        data = JSON.parse(response.body || response);
      } catch {
        data = response.body || response;
      }

      if (Array.isArray(data)) {
        return data as Offer[];
      }

      if (data && typeof data === 'object' && 'offers' in data) {
        return (data as { offers: Offer[] }).offers;
      }

      return [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch mock data: ${errorMessage}`);
    }
  }
}
