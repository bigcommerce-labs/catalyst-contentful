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

  console.log(data.page.topSectionCollection.items[0].bodyText.json.content[0].content[0].value);

  return (
    <>
      {data.page.topSectionCollection.items.map((item) => {
        if (!item) {
          return null;
        }

        if (item.__typename === 'ComponentHeroBanner') {
          return (
            <div key={item.internalName}>
              <h1>{item.headline}</h1>
              <p>{item.bodyText?.json}</p>
            </div>
          );
        }

        return null;
      })}
    </>
  );
};
