import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import sendResponseToken from '../../../shared/sendResponseToken';
import { userFilterableFields } from './user.constant';
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

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, userFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await UsersServices.getAllFromDB(filters, paginationOptions);

    if (result.data.length === 0) {
      return next(new ApiError('No users found!', httpStatus.NOT_FOUND));
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Users retrived successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await UsersServices.getDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No users found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'User retrived successfully',
    data: result,
  });
});

const updateDataById: RequestHandler = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await UsersServices.updateDataById(req.params.id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'User updated successfully',
    data: result,
  });
});

const deleteDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await UsersServices.deleteDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No user found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  insertIntoDB,
  signinUser,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
