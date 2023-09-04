import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = express.Router();

router.get('/:id', CategoryController.getDataById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CategoryValidation.update),
  CategoryController.updateDataById
);

router.post(
  '/create-category',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CategoryValidation.create),
  CategoryController.insertIntoDB
);

router.get('/', CategoryController.getAllFromDB);

export const categoryRoutes = router;
