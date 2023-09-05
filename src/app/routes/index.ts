/* eslint-disable no-unused-vars */
import express from 'express';
import { bookRoutes } from '../modules/book/book.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { orderRoutes } from '../modules/order/order.routes';
import { authRoutes } from '../modules/user/auth.routes';
import { profileRoutes } from '../modules/user/profile.routes';
import { userRoutes } from '../modules/user/user.routes';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/books',
    route: bookRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
  {
    path: '/profile',
    route: profileRoutes,
  },
];

// Application Routes
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
