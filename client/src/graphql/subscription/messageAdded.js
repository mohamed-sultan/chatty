import gql from 'graphql-tag';



export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription messageAdded {
    messageAdded{
        _id
        text
        createdAt
        to{
          _id
          name
        }
        from{
          _id
          username
          email
        }
    }
  }
 
`;


