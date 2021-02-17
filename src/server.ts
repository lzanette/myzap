import 'reflect-metadata';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { serverConfig } from '@config/index';
import AppErrors from '@errors/AppErrors';
import routes from './routes';

import swaggerUI from 'swagger-ui-express'
import specs from './swagger'

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