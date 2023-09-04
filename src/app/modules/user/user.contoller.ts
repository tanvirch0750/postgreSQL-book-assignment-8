import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import sendResponseToken from '../../../shared/sendResponseToken';
import { UsersServices } from './user.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await UsersServices.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'User created successfully',
    data: result,
  });
});

const signinUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UsersServices.loginUser(req.body);

  sendResponseToken(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'User signin successfully!',
    token: result.token,
  });
});

export const UserController = {
  insertIntoDB,
  signinUser,
};
