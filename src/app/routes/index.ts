/* eslint-disable no-unused-vars */
import express from 'express';
import { authRoutes } from '../modules/user/auth.routes';
const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
];

// Application Routes
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
