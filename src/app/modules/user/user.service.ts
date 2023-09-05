import { Prisma, Users } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponseSize } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditionsWithoutRelation } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from './user.constant';
import {
  ISigninUser,
  ISigninUserResponse,
  IUserData,
  IUserFilterRequest,
} from './user.interface';

const insertIntoDB = async (data: Users): Promise<IUserData> => {
  const { name, email, password, role, contactNo, address, profileImg } = data;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  const newData = {
    name,
    email,
    password: hashedPassword,
    contactNo,
    address,
    profileImg,
    role,
  };

  const result = await prisma.users.create({ data: newData });

  const newResultData = {
    id: result.id,
    name: result.name,
    email: result.email,
    role: result.role,
    contactNo: result.contactNo,
    address: result.address,
    profileImg: result.profileImg,
  };

  return newResultData;
};

const loginUser = async (data: ISigninUser): Promise<ISigninUserResponse> => {
  const { email, password } = data;

  // check user exist
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError('User does not exist', httpStatus.NOT_FOUND);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new ApiError('Password is incorrect', httpStatus.UNAUTHORIZED);
  }

  // create access token
  const { id: userId, role, email: userEmail } = user;
  const iat = Math.floor(Date.now() / 1000);

  const token = jwtHelpers.createToken(
    { userId, role, userEmail, iat },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    token,
  };
};

const getAllFromDB = async (
  filters: IUserFilterRequest,
  options: IpaginationOptions
): Promise<IGenericPaginationResponseSize<Users[]>> => {
  const { page, size, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditionsWithoutRelation(
    searchTerm,
    filterData,
    userSearchableFields
  );

  const whereConditons: Prisma.UsersWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.users.findMany({
    where: whereConditons,
    skip,
    take: size,
    orderBy: orderCondition,
  });

  const total = await prisma.users.count();

  return {
    meta: {
      total,
      page,
      size,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Users | null> => {
  const result = await prisma.users.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<Users>
): Promise<IUserData> => {
  const existingUser = await prisma.users.findUnique({
    where: { id: id },
  });

  if (!existingUser) {
    throw new ApiError('User does not exist', httpStatus.NOT_FOUND);
  }

  const result = await prisma.users.update({
    where: {
      id,
    },
    data: {
      ...payload,
      password: payload.password
        ? await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds))
        : undefined,
    },
  });

  const newResultData = {
    id: result.id,
    name: result.name,
    email: result.email,
    role: result.role,
    contactNo: result.contactNo,
    address: result.address,
    profileImg: result.profileImg,
  };

  return newResultData;
};

const deleteDataById = async (id: string): Promise<Users> => {
  const result = await prisma.users.delete({
    where: {
      id,
    },
  });

  return result;
};

export const UsersServices = {
  insertIntoDB,
  loginUser,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
