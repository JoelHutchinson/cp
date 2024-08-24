import { z } from "zod";
import type { H3Event } from "h3";

export const getZodValidatedRouterParams = async <T>(
  event: H3Event,
  schema: z.Schema<T>
) => {
  try {
    return await getValidatedRouterParams(event, schema.parse);
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: `${JSON.parse(error.message)[0].message}`,
    });
  }
};

export const getZodValidatedBody = async <T>(
  event: H3Event,
  schema: z.Schema<T>
) => {
  try {
    return await readValidatedBody(event, schema.parse);
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: `${JSON.parse(error.message)[0].message}`,
    });
  }
};

export const getZodValidatedFormData = async <T>(
  event: H3Event,
  keys: string[],
  schema: z.Schema<T>
): Promise<T> => {
  const formData = await readFormData(event);

  const data: Record<string, any> = {};

  keys.forEach((key) => {
    data[key] = formData.get(key);
  });

  try {
    return await schema.parse(data);
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      message: `${JSON.parse(error.message)[0].message}`,
    });
  }
};
