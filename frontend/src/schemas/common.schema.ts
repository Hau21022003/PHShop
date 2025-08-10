import z from "zod";

export const BaseRes = z.object({
  message: z.string(),
  status: z.string(),
  meta: z.object({
    timestamp: z.string(),
    path: z.string(),
  }),
});

export type BaseResType = z.TypeOf<typeof BaseRes>;

export const createBaseResp = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseRes.extend({
    data: dataSchema,
  });

export const PaginationBody = z
  .object({
    pageNumber: z.number().int().min(1).default(1).optional(),
    pageSize: z.number().int().min(10).default(10).optional(),
  })
  .strict();

export type PaginationBodyType = z.TypeOf<typeof PaginationBody>;
export const createPaginationBody = <T extends z.ZodRawShape>(
  itemSchema: z.ZodObject<T>
) => PaginationBody.merge(itemSchema);

export const PageMeta = z.object({
  total: z.number().default(0),
  pageNumber: z.number().default(1),
  pageSize: z.number().default(10),
  totalPages: z.number().default(0),
  hasNextPage: z.boolean().default(false),
  hasPrevPage: z.boolean().default(false),
});
export type PageMetaType = z.TypeOf<typeof PageMeta>;

export const createPaginationRes = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
  });

export const defaultPageMeta: PageMetaType = PageMeta.parse({});
