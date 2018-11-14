import gql from "graphql-tag";

export const LoginQuery = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
