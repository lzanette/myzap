import 'reflect-metadata';
import './database';

import express, { NextFunction, Request, Response } from 'express';

import AppErrors from '@/app/errors/AppErrors';
import cors from 'cors';
import routes from '@/routes';
import { serverConfig } from '@/config/index';
import specs from './swagger';
import swaggerUI from 'swagger-ui-express';

const server = express();

// -- Middleware
server.use(express.json());
server.use(cors());
server.use(routes);

server.use('/docs', swaggerUI.serve, swaggerUI.setup(specs))

server.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppErrors) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }
    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      detail: {
        error: true,
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  },
);

server.listen(serverConfig.port, serverConfig.host, () => {
  console.info(
    `Server running at: http://${serverConfig.host}:${serverConfig.port}`,
  );
});