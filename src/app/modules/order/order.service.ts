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
    include: {
      user: true,
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
    include: {
      user: true,
    },
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

const getDataById = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
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
    include: {
      user: true,
    },
  });

  return result;
};

// const getDataByCategory = async (categoryId: string): Promise<Book[]> => {
//   const books = await prisma.book.findMany({
//     include: {
//       category: true,
//     },
//     where: {
//       category: {
//         id: categoryId,
//       },
//     },
//   });

//   if (!books || books.length === 0) {
//     throw new ApiError(
//       'No books found for the specified category',
//       httpStatus.NOT_FOUND
//     );
//   }

//   return books;
// };

export const OrderServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  //   deleteDataById,
  //   getDataByCategory,
};
