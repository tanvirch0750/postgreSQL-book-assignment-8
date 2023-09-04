export const bookSearchableFields = ['title', 'author', 'genre'];

export const bookFilterableFields = [
  'searchTerm',
  'categoryId',
  'genre',
  'author',
];

export const bookRelationalFields: string[] = ['categoryId'];

export const bookRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: 'category',
};
