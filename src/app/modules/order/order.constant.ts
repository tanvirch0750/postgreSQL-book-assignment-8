export const orderSearchableFields = [];

export const orderFilterableFields = ['searchTerm', 'userId', 'status'];

export const orderRelationalFields: string[] = ['userId'];

export const orderRelationalFieldsMapper: { [key: string]: string } = {
  userId: 'user',
};
