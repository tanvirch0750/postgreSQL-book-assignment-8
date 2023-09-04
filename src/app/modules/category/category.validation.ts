import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Category title is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const CatgoryValidation = {
  create,
  update,
};
