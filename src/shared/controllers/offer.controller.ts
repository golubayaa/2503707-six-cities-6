import { Router, Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController, Controller } from './index.js';
import asyncHandler from 'express-async-handler';
import { OfferEntity } from '../modules/offer/index.js';

@injectable()
export class OfferController extends BaseController implements Controller {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this._registerRoutes();
  }

  private _registerRoutes(): void {
    this.router.get(
      '/',
      asyncHandler((req: Request, res: Response) => this.getOffers(req, res))
    );

    this.router.post(
      '/',
      asyncHandler((req: Request, res: Response) => this.createOffer(req, res))
    );

    this.router.get(
      '/premium/:city',
      asyncHandler((req: Request, res: Response) => this.getPremiumOffers(req, res))
    );

    this.router.get(
      '/favorite',
      asyncHandler((req: Request, res: Response) => this.getFavoriteOffers(req, res))
    );

    this.router.post(
      '/favorite/:offerId',
      asyncHandler((req: Request, res: Response) => this.addToFavorite(req, res))
    );

    this.router.delete(
      '/favorite/:offerId',
      asyncHandler((req: Request, res: Response) => this.removeFromFavorite(req, res))
    );

    this.router.get(
      '/:offerId',
      asyncHandler((req: Request, res: Response) => this.getOffer(req, res))
    );

    this.router.put(
      '/:offerId',
      asyncHandler((req: Request, res: Response) => this.updateOffer(req, res))
    );

    this.router.delete(
      '/:offerId',
      asyncHandler((req: Request, res: Response) => this.deleteOffer(req, res))
    );
  }

  public getOffers(req: Request, res: Response): void {
    const limit = req.query.limit ? Number(req.query.limit) : 60;

    // Mock response
    const offers = [
      {
        id: '1',
        title: 'Cozy apartment in Paris',
        description: 'Beautiful and comfortable apartment',
        createdAt: new Date().toISOString(),
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522 },
        },
        previewPath: '/preview.jpg',
        images: ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg', '/img5.jpg', '/img6.jpg'],
        isPremium: true,
        isFavorite: false,
        rating: 4.8,
        type: 'apartment',
        roomsCount: 2,
        guestsCount: 4,
        price: 120,
        conveniences: ['WiFi', 'Breakfast'],
        author: {
          name: 'John Doe',
          email: 'john@example.com',
          avatarPath: '/avatar.jpg',
          type: 'pro',
        },
        commentsCount: 5,
        coordinates: { latitude: 48.8566, longitude: 2.3522 },
      },
    ];

    this.sendOk(res, offers);
  }

  public createOffer(req: Request, res: Response): void {
    const offerData = req.body;

    // Mock response
    const newOffer = {
      id: '2',
      ...offerData,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      rating: 0,
      author: {
        name: 'Current User',
        email: 'user@example.com',
        type: 'ordinary',
      },
      commentsCount: 0,
    };

    this.sendCreated(res, newOffer);
  }

  public getOffer(req: Request, res: Response): void {
    const { offerId } = req.params;

    // Mock response
    const offer = {
      id: offerId,
      title: 'Cozy apartment',
      description: 'Beautiful apartment',
      createdAt: new Date().toISOString(),
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522 },
      },
      previewPath: '/preview.jpg',
      images: ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg', '/img5.jpg', '/img6.jpg'],
      isPremium: true,
      isFavorite: false,
      rating: 4.8,
      type: 'apartment',
      roomsCount: 2,
      guestsCount: 4,
      price: 120,
      conveniences: ['WiFi', 'Breakfast'],
      author: {
        name: 'John Doe',
        email: 'john@example.com',
        avatarPath: '/avatar.jpg',
        type: 'pro',
      },
      commentsCount: 5,
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
    };

    this.sendOk(res, offer);
  }

  public updateOffer(req: Request, res: Response): void {
    const { offerId } = req.params;
    const updateData = req.body;

    // Mock response
    const updatedOffer = {
      id: offerId,
      ...updateData,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      rating: 4.8,
      author: {
        name: 'Current User',
        email: 'user@example.com',
        type: 'ordinary',
      },
      commentsCount: 5,
    };

    this.sendOk(res, updatedOffer);
  }

  public deleteOffer(req: Request, res: Response): void {
    // Mock response
    this.sendNoContent(res);
  }

  public getPremiumOffers(req: Request, res: Response): void {
    const { city } = req.params;

    // Mock response
    const premiumOffers = [
      {
        id: '1',
        title: `Premium apartment in ${ city}`,
        description: 'Luxury apartment',
        createdAt: new Date().toISOString(),
        city: {
          name: city,
          location: { latitude: 48.8566, longitude: 2.3522 },
        },
        previewPath: '/preview.jpg',
        images: ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg', '/img5.jpg', '/img6.jpg'],
        isPremium: true,
        isFavorite: false,
        rating: 5,
        type: 'apartment',
        roomsCount: 3,
        guestsCount: 6,
        price: 250,
        conveniences: ['WiFi', 'Breakfast', 'Pool'],
        author: {
          name: 'Premium Host',
          email: 'host@example.com',
          type: 'pro',
        },
        commentsCount: 10,
        coordinates: { latitude: 48.8566, longitude: 2.3522 },
      },
    ];

    this.sendOk(res, premiumOffers);
  }

  public getFavoriteOffers(req: Request, res: Response): void {
    // Mock response
    const favoriteOffers: OfferEntity[] = [];

    this.sendOk(res, favoriteOffers);
  }

  public addToFavorite(req: Request, res: Response): void {
    const { offerId } = req.params;

    // Mock response
    this.sendOk(res, { message: 'Offer added to favorites' });
  }

  public removeFromFavorite(req: Request, res: Response): void {
    const { offerId } = req.params;

    // Mock response
    this.sendOk(res, { message: 'Offer removed from favorites' });
  }
}
