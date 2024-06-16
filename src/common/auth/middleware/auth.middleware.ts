import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@common/auth/roles.enum';

interface CustomRequest extends Request {
  user?: {
    role: UserRole;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (token === 'admin-token') {
      req.user = { role: UserRole.ADMIN };
    } else if (token === 'student-token') {
      req.user = { role: UserRole.STUDENT };
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
