import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OrderServices } from './order.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const verifiedUser = jwtHelpers.verifyToken(
    token as string,
    config.jwt.secret as string
  );

  const result = await OrderServices.insertIntoDB(
    req.body,
    verifiedUser.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Order created successfully',
    data: result,
  });
});

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const token = req.headers.authorization;

    const verifiedUser = jwtHelpers.verifyToken(
      token as string,
      config.jwt.secret as string
    );

    const paginationOptions = pick(req.query, paginationFields);

    const result = await OrderServices.getAllFromDB(
      paginationOptions,
      verifiedUser
    );

    if (result.data.length === 0) {
      return next(new ApiError('No order found!', httpStatus.NOT_FOUND));
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Order retrived successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;

  const verifiedUser = jwtHelpers.verifyToken(
    token as string,
    config.jwt.secret as string
  );

  const result = await OrderServices.getDataById(req.params.id, verifiedUser);

  if (!result) {
    return next(new ApiError(`No order found`, httpStatus.NOT_FOUND));
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Order retrived successfully',
    data: result,
  });
});

const updateDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body;

  const result = await OrderServices.updateDataById(req.params.id, payload);

  if (!result) {
    return next(
      new ApiError(`No Order found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Order updated successfully',
    data: result,
  });
});

export const OrderController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
};
