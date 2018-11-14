import gql from 'graphql-tag';

export const Upfate_GROUP_MUTATION = gql`
  mutation updateeGroup($oldName: String!,$ewName:Strign!) {
    updateeGroup(oldName: $oldName,newName:$ewName) {
      id
      name
      
    }
  }
`;

