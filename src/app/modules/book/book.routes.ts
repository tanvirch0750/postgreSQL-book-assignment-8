import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { BookController } from './book.controller';
import { BookValidation } from './book.validation';

const router = express.Router();

router.get('/:id', BookController.getDataById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  BookController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BookValidation.update),
  BookController.updateDataById
);

router.post(
  '/create-book',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BookValidation.create),
  BookController.insertIntoDB
);

router.get('/', BookController.getAllFromDB);

export const bookRoutes = router;
