import { z } from 'zod';
import { BaseIdentifier, BaseSchema } from './base.schema';

export const KittyCatSchema = z.object({
    name: z.string().optional(),
});

export const KittyCatUpdateSchema = z.object({
    id: z.string(),
}).merge(KittyCatSchema).strict();

export const KittyCatRequestSchema = KittyCatSchema.strict();

export const KittyCatResponseSchema = z.object({
    ...BaseIdentifier.shape,
    ...KittyCatSchema.shape,
});

export const KittyCatEntitySchema = z.object({
    ...KittyCatSchema.shape,
    ...BaseSchema.shape,
});

export type KittyCatItemRecord = z.infer<typeof KittyCatEntitySchema>;

export type KittyCat = z.infer<typeof KittyCatSchema>;

export type KittyCatResponse = z.infer<typeof KittyCatResponseSchema>;

export type KittyCatUpdate = z.infer<typeof KittyCatUpdateSchema>;
