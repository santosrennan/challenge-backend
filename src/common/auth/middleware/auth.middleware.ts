import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@common/auth/roles.enum';

interface CustomRequest extends Request {
  user: {
    role: UserRole;
    id: string;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    const userId = req.headers['userid'];

    if (!token || !userId) {
      throw new UnauthorizedException('Token or UserId missing');
    }

    if (token === 'admin-token') {
      req.user = { role: UserRole.ADMIN, id: userId as string };
    } else if (token === 'student-token') {
      req.user = { role: UserRole.STUDENT, id: userId as string };
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
