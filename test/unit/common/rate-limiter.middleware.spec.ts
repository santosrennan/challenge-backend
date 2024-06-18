import { RateLimiterMiddleware } from '@common/rate-limiter/rate-limiter.middleware';
import { Request, Response, NextFunction } from 'express';

jest.mock('express-rate-limit');

describe('RateLimiterMiddleware', () => {
  let middleware: RateLimiterMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    middleware = new RateLimiterMiddleware();
    req = { ip: '127.0.0.1' };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow requests under the limit', () => {
    const limiterMock = jest.fn().mockImplementation((req, res, next) => {
      next();
    });
    (middleware as any).limiter = limiterMock;

    middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return 429 when rate limit is exceeded', () => {
    const rateLimitError = new Error('Rate limit exceeded') as any;
    rateLimitError.statusCode = 429;

    const limiterMock = jest.fn().mockImplementation((req, res, next) => {
      res
        .status(429)
        .send('Too many requests from this IP, please try again later.');
    });

    (middleware as any).limiter = limiterMock;

    middleware.use(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith(
      'Too many requests from this IP, please try again later.',
    );
    expect(next).not.toHaveBeenCalled();
  });
});
