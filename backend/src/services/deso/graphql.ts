import { GraphQLClient, gql } from 'graphql-request';

const API_URL = 'https://graphql.focus.xyz/graphql';

export const desoGraphClient = new GraphQLClient(API_URL, { fetch });