import Image from 'next/image';

import {
  Slideshow,
  SlideshowAutoplayControl,
  SlideshowContent,
  SlideshowControls,
  SlideshowNextIndicator,
  SlideshowPagination,
  SlideshowPreviousIndicator,
  SlideshowSlide,
} from '@bigcommerce/components/slideshow';

import { contentfulClient, contentfulGraphql } from '../client';

export const Banner = async () => {
  const HOME_CONTENT_QUERY = contentfulGraphql(`
    query HomeContent($pageId: String!) {
      page(id: $pageId) {
        internalName
        topSectionCollection {
          items {
            __typename
            ... on ComponentHeroBanner {
              internalName
              headline
              bodyText {
                json
              }
              image {
                url
                title
                description
              }
            }
          }
        }
      }
    }
  `);

  const { data } = await contentfulClient.fetch({
    document: HOME_CONTENT_QUERY,
    variables: { pageId: '3t7Iub6Arm23Cn7wWkIJTd' },
  });

  if (!data.page) {
    return null;
  }

  if (!data.page.topSectionCollection) {
    return null;
  }

  return (
    <Slideshow>
      <SlideshowContent>
        {data.page.topSectionCollection.items.map((item) => {
          if (!item) {
            return null;
          }

          if (item.__typename === 'ComponentHeroBanner') {
            return (
              <SlideshowSlide key={item.internalName}>
                <div className="relative">
                  {item.image && (
                    <Image
                      alt={item.image.title || ''}
                      className="absolute -z-10 object-cover"
                      fill
                      priority
                      sizes="(max-width: 1536px) 100vw, 1536px"
                      src={item.image.url || ''}
                    />
                  )}
                  <div className="flex flex-col gap-4 px-12 pb-48 pt-36">
                    <h2 className="text-5xl font-black lg:text-6xl">{item.headline}</h2>
                    {/* eslint-disable @typescript-eslint/no-unsafe-member-access */}
                    {/* @ts-expect-error @todo refactor */}
                    <p className="max-w-xl">{item.bodyText.json.content[0]?.content[0]?.value}</p>
                    {/* eslint-enable @typescript-eslint/no-unsafe-member-access */}
                  </div>
                </div>
              </SlideshowSlide>
            );
          }

          return null;
        })}
      </SlideshowContent>
      <SlideshowControls>
        <SlideshowAutoplayControl />
        <SlideshowPreviousIndicator />
        <SlideshowPagination />
        <SlideshowNextIndicator />
      </SlideshowControls>
    </Slideshow>
  );
};
