import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserController } from './user.contoller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.create),
  UserController.insertIntoDB
);

router.post(
  '/signin',
  validateRequest(UserValidation.userLogin),
  UserController.signinUser
);

export const authRoutes = router;
