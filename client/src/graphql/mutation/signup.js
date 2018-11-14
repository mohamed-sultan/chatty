import gql from "graphql-tag";
export const SIGNUP_MUTATION = gql`
  mutation signUp($email: String!, $password: String!, $username: String!) {
    signup(email: $email, password: $password, username: $username) {
      token
    }
  }
`;
