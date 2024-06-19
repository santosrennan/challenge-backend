import { UnauthorizedException } from '@nestjs/common';
import { AuthMiddleware } from '@common/auth/middleware/auth.middleware';
import { UserRole } from '@common/auth/roles.enum';

const mockRequest = () => {
  const req: any = {};
  req.headers = {};
  return req;
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;

  beforeEach(() => {
    middleware = new AuthMiddleware();
  });

  it('should throw UnauthorizedException if token or userId is missing', () => {
    const req = mockRequest();
    const res = mockResponse();
    const mockNext = jest.fn();

    expect(() => middleware.use(req, res, mockNext)).toThrowError(
      UnauthorizedException,
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should set user role to ADMIN if token is admin-token', () => {
    const req = mockRequest();
    req.headers['authorization'] = 'admin-token';
    req.headers['userid'] = 'user1';
    const res = mockResponse();

    middleware.use(req, res, mockNext);

    expect(req.user.role).toBe(UserRole.ADMIN);
    expect(req.user.id).toBe('user1');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should set user role to STUDENT if token is student-token', () => {
    const req = mockRequest();
    req.headers['authorization'] = 'student-token';
    req.headers['userid'] = 'user2';
    const res = mockResponse();

    middleware.use(req, res, mockNext);

    expect(req.user.role).toBe(UserRole.STUDENT);
    expect(req.user.id).toBe('user2');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return Unauthorized response for invalid token', () => {
    const req = mockRequest();
    req.headers['authorization'] = 'invalid-token';
    req.headers['userid'] = 'user3';
    const res = mockResponse();

    const mockNext = jest.fn();

    middleware.use(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });

    expect(mockNext).not.toHaveBeenCalled();
  });
});
