import gql from "graphql-tag";

export const createMessageMutation = gql`
  mutation createMessage($text: String!, $groupId: String) {
    createMessage(text: $text, groupId: $groupId) {
      text
      _id
      createdAt
      from {
        username
        _id
        email
      }
      to {
        _id
        name
      }
    }
  }
`;
