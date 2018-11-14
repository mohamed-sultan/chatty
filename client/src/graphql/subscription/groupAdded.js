import gql from "graphql-tag";

export const GROUP_ADDED_SUBSCRIPTION = gql`
  subscription groupAdded {
    groupAdded {
      _id
      name
      admin
      messages {
        _id
        text
        createdAt
        from {
          _id
          username
          email
        }
      }
    }
  }
`;
