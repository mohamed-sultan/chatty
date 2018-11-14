import gql from "graphql-tag";

export const getGroupMessage = gql`
  query getMessages($groupId: String!) {
    getMessages(groupId: $groupId) {
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
`;

export const getGroups = gql`
  {
    getGroups {
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
        to {
          _id
          name
        }
      }
    }
  }
`;
