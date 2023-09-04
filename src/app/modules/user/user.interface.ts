export type IUserFilterRequest = {
  searchTerm?: string | undefined;
  name?: string | undefined;
  role?: string | undefined;
  email?: string | undefined;
};

export type IUserData = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  contactNo: string;
  address: string;
  profileImg: string;
};

export type ISigninUser = {
  email: string;
  password: string;
};

export type ISigninUserResponse = {
  token: string;
};
