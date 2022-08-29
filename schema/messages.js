const typeDefs = {
    root: `
    type Messages {
      _id :String
      receiverId : String
      senderEmail : String
      senderId : String
      emoji : [String]
      files : String
      message : String
      createdAt : String
      updatedAt : String
      receiverEmail : String
      chatLogs : ChatLogs

    }
          input MessageInput{
            emoji : String
            message : String
            senderEmail : String
            chatLogs : String
            createdAt : String
            updatedAt : String
            receiverId: String
            files : String
            receiverType: String
            receiverEmail : String

        }
          input MessageUpdate {
            emoji : String
            message : String
            createdAt : String
            chatLogs : String
            updatedAt : String
            receiverId: String
            files : String

        }
          
          type MessageDelete{
              id:ID
              emoji : String
              Message : [String]
          }
          union MessageUnion = Messages | err
      `,
    query: `
          type Query {
              messages:[Messages]
              message(_id : String,createdAt:String):MessageUnion
          }
      `,
    mutation: `
          type Mutation {
              addMessage(input : MessageInput):GraphqlUnion
              updateMessage(updateID: String!,update:MessageUpdate):GraphqlUnion
              deleteMessage(id : String!):GraphqlUnion
              addFiles(url:String,userType:String):GraphqlUnion
            }
       `,
  };
  module.exports = typeDefs;
  