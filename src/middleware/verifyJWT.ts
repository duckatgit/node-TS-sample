import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import environment from '../config/environment';
import logger from '../service/logger';

const JWT_SECRET = environment.JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; 

  if (!token) {
    res.status(403).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.info('[verifyTokenMiddlewate]: ', err)
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
