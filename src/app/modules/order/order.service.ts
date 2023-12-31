import { Order, Prisma } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponseSize } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Order, userId: string): Promise<Order> => {
  const { orderedBooks } = data;

  const result = await prisma.order.create({
    data: {
      userId,
      orderedBooks: orderedBooks as Prisma.InputJsonValue,
    },
  });

  return result;
};

const getAllFromDB = async (
  options: IpaginationOptions,
  verifiedUser: JwtPayload
): Promise<IGenericPaginationResponseSize<Order[]>> => {
  const { page, size, skip } = calculatePagination(options);

  const orderCondition = orderByConditions(options);

  let whereCondition: Prisma.OrderWhereInput = {};

  if (verifiedUser.role === 'customer') {
    // If the user is a customer, filter orders by their user ID
    whereCondition = {
      userId: verifiedUser.userId,
    };
  }

  const result = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: size,
    orderBy: orderCondition,
  });

  const total = await prisma.order.count();

  return {
    meta: {
      total,
      page,
      size,
    },
    data: result,
  };
};

const getDataById = async (
  id: string,
  verifiedUser: JwtPayload
): Promise<Order | null> => {
  let result: Order | null = null;

  if (verifiedUser.role === 'admin') {
    result = await prisma.order.findUnique({
      where: { id },
    });
  } else if (verifiedUser.role === 'customer') {
    result = await prisma.order.findUnique({
      where: { id, userId: verifiedUser.userId },
    });
  }

  return result;
};

const updateDataById = async (
  id: string,
  payload: Prisma.OrderUpdateInput
): Promise<Order> => {
  const result = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

export const OrderServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
};
