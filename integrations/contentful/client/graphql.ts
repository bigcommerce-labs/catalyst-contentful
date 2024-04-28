import { initGraphQLTada } from 'gql.tada';

import type { introspection } from '~/contentful-env';

export const contentfulGraphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    Dimension: number;
    Quality: number;
    HexColor: string;
    JSON: Record<string, unknown>;
  };
  disableMasking: true;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
