import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Component } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { CommentController, UserController, OfferController } from '../shared/controllers/index.js'

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<CommentController>(Component.CommentController).to(CommentController).inSingletonScope();
  restApplicationContainer.bind<OfferController>(Component.OfferController).to(OfferController).inSingletonScope();
  restApplicationContainer.bind<UserController>(Component.UserController).to(UserController).inSingletonScope();

  return restApplicationContainer;
}
