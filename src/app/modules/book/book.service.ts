import { Book, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponseSize } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import {
  bookRelationalFields,
  bookRelationalFieldsMapper,
  bookSearchableFields,
} from './book.constant';
import { IBookFilters } from './book.interface';

const insertIntoDB = async (data: Book): Promise<Book> => {
  const result = await prisma.book.create({
    data,
    include: {
      category: true,
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IBookFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponseSize<Book[]>> => {
  const { page, size, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filterData,
    bookSearchableFields,
    bookRelationalFields,
    bookRelationalFieldsMapper
  );

  const whereConditons: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.book.findMany({
    include: {
      category: true,
    },
    where: whereConditons,
    skip,
    take: size,
    orderBy: orderCondition,
  });

  const total = await prisma.book.count();

  return {
    meta: {
      total,
      page,
      size,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<Book>
): Promise<Book> => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
    include: {
      category: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<Book> => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const getDataByCategory = async (categoryId: string): Promise<Book[]> => {
  const books = await prisma.book.findMany({
    include: {
      category: true,
    },
    where: {
      category: {
        id: categoryId,
      },
    },
  });

  if (!books || books.length === 0) {
    throw new ApiError(
      'No books found for the specified category',
      httpStatus.NOT_FOUND
    );
  }

  return books;
};

export const BookServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
  getDataByCategory,
};
