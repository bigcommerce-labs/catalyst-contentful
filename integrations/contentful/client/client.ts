import { ContentfulAPIError } from './error';
import { DocumentDecoration } from './types';
import { getOperationInfo } from './utils/get-operation-name';
import { normalizeQuery } from './utils/normalize-query';

export const graphqlApiDomain: string =
  process.env.CONTENTFUL_GRAPHQL_API_DOMAIN ?? 'graphql.contentful.com';

interface Config {
  conttenfulSpaceId: string;
  contentfulAccessToken: string;
  logger?: boolean;
}

interface ContentfulResponse<T> {
  data: T;
}

class Client<FetcherRequestInit extends RequestInit = RequestInit> {
  private graphqlUrl: string;

  constructor(private config: Config) {
    this.graphqlUrl = `https://${graphqlApiDomain}/content/v1/spaces/${config.conttenfulSpaceId}`;
  }

  // Overload for documents that require variables
  async fetch<TResult, TVariables extends Record<string, unknown>>(config: {
    document: DocumentDecoration<TResult, TVariables>;
    variables: TVariables;
    customerId?: string;
    fetchOptions?: FetcherRequestInit;
  }): Promise<ContentfulResponse<TResult>>;

  // Overload for documents that do not require variables
  async fetch<TResult>(config: {
    document: DocumentDecoration<TResult, Record<string, never>>;
    variables?: undefined;
    customerId?: string;
    fetchOptions?: FetcherRequestInit;
  }): Promise<ContentfulResponse<TResult>>;

  async fetch<TResult, TVariables>({
    document,
    variables,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    fetchOptions = {} as FetcherRequestInit,
  }: {
    document: DocumentDecoration<TResult, TVariables>;
    variables?: TVariables;
    customerId?: string;
    fetchOptions?: FetcherRequestInit;
  }): Promise<ContentfulResponse<TResult>> {
    const { cache, headers = {}, ...rest } = fetchOptions;
    const query = normalizeQuery(document);
    const log = this.requestLogger(query);

    const response = await fetch(this.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.contentfulAccessToken}`,
        ...headers,
      },
      body: JSON.stringify({
        query,
        ...(variables && { variables }),
      }),
      ...(cache && { cache }),
      ...rest,
    });

    if (!response.ok) {
      throw await ContentfulAPIError.createFromResponse(response);
    }

    log(response);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return response.json() as Promise<ContentfulResponse<TResult>>;
  }

  private requestLogger(document: string) {
    if (!this.config.logger) {
      return () => {
        // noop
      };
    }

    const operationInfo = getOperationInfo(document);

    const timeStart = Date.now();

    return (response: Response) => {
      const timeEnd = Date.now();
      const duration = timeEnd - timeStart;

      const complexity = response.headers.get('X-Contentful-Graphql-Query-Cost');

      // eslint-disable-next-line no-console
      console.log(
        `[Contentful] ${operationInfo?.type || 'NO_TYPE'} ${operationInfo?.name ?? 'anonymous'} - ${duration}ms - complexity ${complexity ?? 'unknown'}`,
      );
    };
  }
}

export function createContentfulClient<FetcherRequestInit extends RequestInit = RequestInit>(
  config: Config,
) {
  return new Client<FetcherRequestInit>(config);
}
