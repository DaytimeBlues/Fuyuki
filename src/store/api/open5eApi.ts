import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

const DescriptionSchema = z.union([z.string(), z.array(z.string())]).transform((value) =>
  Array.isArray(value) ? value.join('\n\n') : value
);

const SpellSchema = z.object({
  name: z.string(),
  desc: DescriptionSchema,
  higher_level: DescriptionSchema.optional(),
  range: z.string(),
  components: z.string(),
  duration: z.string(),
  concentration: z.string(),
  casting_time: z.string(),
  level: z.string(),
  level_int: z.number(),
  school: z.string(),
});

export type Open5eSpell = z.infer<typeof SpellSchema>;

export const open5eApi = createApi({
  reducerPath: 'open5eApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.open5e.com/',
  }),
  endpoints: (builder) => ({
    getSpell: builder.query<Open5eSpell, string>({
      query: (slug) => `spells/${slug}/`,
      transformResponse: (response: unknown) => {
        const parsed = SpellSchema.safeParse(response);
        if (!parsed.success) {
          console.error('Invalid spell data:', parsed.error);
          throw new Error('Invalid spell data from API');
        }
        return parsed.data;
      },
    }),
    getMonster: builder.query<unknown, string>({
      query: (slug) => `monsters/${slug}/`,
    }),
    searchSpells: builder.query<unknown, string>({
      query: (search) => `spells/?search=${encodeURIComponent(search)}`,
    }),
  }),
});

export const { useGetSpellQuery, useGetMonsterQuery, useSearchSpellsQuery } = open5eApi;
