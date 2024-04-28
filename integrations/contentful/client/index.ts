import { createContentfulClient } from './client';

export { ContentfulAPIError } from './error';
export { removeEdgesAndNodes } from './utils/remove-edges-and-nodes';

export const contentfulClient = createContentfulClient({
  conttenfulSpaceId: process.env.CONTENTFUL_SPACE_ID ?? '',
  contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? '',
  logger: process.env.NODE_ENV !== 'production' || process.env.CONTENTFUL_LOGGER === 'true',
});
