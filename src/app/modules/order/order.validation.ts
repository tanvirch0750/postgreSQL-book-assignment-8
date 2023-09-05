import { Status } from '@prisma/client';
import { z } from 'zod';

const create = z.object({
  body: z.object({
    orderedBooks: z.array(
      z.object({
        bookId: z.string({
          required_error: 'book is required',
        }),
        quantity: z.number({
          required_error: 'quantity is required',
        }),
      })
    ),
  }),
});

const update = z.object({
  body: z.object({
    orderedBooks: z
      .array(
        z.object({
          bookId: z.string().optional(),
          quantity: z.number().optional(),
        })
      )
      .optional(),
    status: z
      .enum([...Object.values(Status)] as [string, ...string[]], {})
      .optional(),
  }),
});

export const OrderValidation = {
  create,
  update,
};
