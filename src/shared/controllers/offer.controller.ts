import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController, Controller } from './index.js';
import asyncHandler from 'express-async-handler';
import { OfferEntity, OfferService } from '../modules/offer/index.js';
import { DocumentExistsMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../middlewares/index.js';
import { CreateOfferDto } from '../modules/offer/dto/create-offer.dto.js';
import { UpdateOfferDto } from '../modules/offer/dto/update-offer.dto.js';
import { Component } from '../types/index.js';

@injectable()
export class OfferController extends BaseController implements Controller {
  public router: Router;

  constructor(
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super();
    this.router = Router();
    this._registerRoutes();
  }

  private _registerRoutes(): void {
    const validateObjectId = new ValidateObjectIdMiddleware('offerId');
    const validateCreateOfferDto = new ValidateDtoMiddleware(CreateOfferDto);
    const validateUpdateOfferDto = new ValidateDtoMiddleware(UpdateOfferDto);
    const checkOfferExists = new DocumentExistsMiddleware('offerId', this.offerService);

    // GET /offers
    this.registerRoute({
      path: '/',
      method: 'get',
      handler: (req, res) => this.index(req, res),
    });

    // POST /offers
    this.registerRoute({
      path: '/',
      method: 'post',
      handler: (req, res) => this.create(req, res),
      middlewares: [validateCreateOfferDto],
    });

    // GET /offers/premium/:city
    this.registerRoute({
      path: '/premium/:city',
      method: 'get',
      handler: (req, res) => this.getPremiumOffers(req, res),
    });

    // GET /offers/favorite
    this.registerRoute({
      path: '/favorite',
      method: 'get',
      handler: (req, res) => this.getFavoriteOffers(req, res),
    });

    // POST /offers/favorite/:offerId
    this.registerRoute({
      path: '/favorite/:offerId',
      method: 'post',
      handler: (req, res) => this.addToFavorite(req, res),
      middlewares: [validateObjectId, checkOfferExists],
    });

    // DELETE /offers/favorite/:offerId
    this.registerRoute({
      path: '/favorite/:offerId',
      method: 'delete',
      handler: (req, res) => this.removeFromFavorite(req, res),
      middlewares: [validateObjectId, checkOfferExists],
    });

    // GET /offers/:offerId
    this.registerRoute({
      path: '/:offerId',
      method: 'get',
      handler: (req, res) => this.show(req, res),
      middlewares: [validateObjectId, checkOfferExists],
    });

    // PUT /offers/:offerId
    this.registerRoute({
      path: '/:offerId',
      method: 'put',
      handler: (req, res) => this.update(req, res),
      middlewares: [validateObjectId, validateUpdateOfferDto, checkOfferExists],
    });

    // DELETE /offers/:offerId
    this.registerRoute({
      path: '/:offerId',
      method: 'delete',
      handler: (req, res) => this.delete(req, res),
      middlewares: [validateObjectId, checkOfferExists],
    });
  }


  public index(req: Request, res: Response): void {
    const limit = req.query.limit ? Number(req.query.limit) : 60;

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

  public create(req: Request, res: Response): void {
    const offerData = req.body;

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

  public show(req: Request, res: Response): void {
    const { offerId } = req.params;

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

  public update(req: Request, res: Response): void {
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

  public delete(req: Request, res: Response): void {
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
