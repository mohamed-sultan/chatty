import gql from "graphql-tag";

export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($name: String!) {
    createGroup(name: $name) {
      _id
      name
      admin
    }
  }
`;
