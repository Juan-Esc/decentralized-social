import { gql } from "graphql-request";

export const getDSocialRecentFeedQuery = gql`
   query ExampleQuery($filter: PostFilter, $condition: LikeCondition, $orderBy: [PostsOrderBy!]) {
  id
  query {
    posts(filter: $filter, orderBy: $orderBy) {
      nodes {
        body
        postHash
        poster {
          username
          profilePic
          publicKey
        }
        timestamp
        likes: likes {
          totalCount
        }
        likesByReaders: likes(condition: $condition) {
          totalCount
        }
        replies {
          totalCount
        }
        imageUrls
      }
    }
  }
}
`;