import gql from "graphql-tag";

export const GROUP_Deleted_SUBSCRIPTION = gql`
  subscription groupDeleted {
    groupDeleted {
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
