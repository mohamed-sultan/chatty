import gql from "graphql-tag";

export const Delete_GROUP_MUTATION = gql`
  mutation deleteGroup($_id: String!) {
    deleteGroup(_id: $_id) {
      _id
      name
    }
  }
`;
