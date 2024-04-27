# Catalyst + Contentful
> This example integration features [`gql.tada` multi-schema mode](https://gql-tada.0no.co/devlog/2024-04-26) to allow for seamless typesafe GraphQL API calls to [the Contentful GraphQL API](https://www.contentful.com/developers/docs/references/graphql/).

## Getting Started

1. Clone repository and install dependencies

```bash
git clone git@github.com:bigcommerce-labs/catalyst-contentful.git && cd catalyst-contentful && pnpm i
```

2. Copy environment variable template and enter values for each variable

```bash
cp .env.example .env.local
```

3. Fetch the Contentful GraphQL schema using `gql.tada` CLI

```bash
source .env.local
pnpm exec gql.tada generate-schema "https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}" -o ./contentful.graphql --header "Authorization: Bearer ${CONTENTFUL_ACCESS_TOKEN}"
```
