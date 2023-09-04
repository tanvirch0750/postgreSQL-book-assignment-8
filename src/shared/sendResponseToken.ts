import { Response } from 'express';

type IApiReponse<T> = {
  statusCode: number;
  success: boolean;
  status: 'success';
  message?: string | null;
  token: T | string;
};

const sendResponseToken = <T>(res: Response, data: IApiReponse<T>): void => {
  const responseData: IApiReponse<T> = {
    statusCode: data.statusCode,
    success: true,
    status: data.status,
    message: data.message || null,
    token: data.token,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponseToken;
