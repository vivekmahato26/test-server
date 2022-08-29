const typeDefs = {
  root: `
    type Mentor {    
        _id :String
        firstName: String
        userName : String
        lastName: String
        phone: String
        gender : String
        address: Address
        dateOfBirth: String
        createdAt : String
        updatedAt : String
        qualification : String
        experience : String
        CourseAllocated : String
        tickets : [Tickets]
        email: String!
        password: String
        chatLogs : [ChatLogs]
        course : Course
        batch : Batch
            
    }

    input MentorInput {
        
        firstName: String
        userName : String
        lastName: String
        phone: String
        gender : String
        dateOfBirth: String
        createdAt : String
        updatedAt : String
        qualification : String
        experience : String
        CourseAllocated : String
        address : String
        tickets : String
        chatLogs : [String]
        email: String!
        password: String
        course : String
        batch : String
        
    }
    input MentorUpdate{
        firstName: String
        userName : String
        lastName: String
        phone: String
        gender : String
        dateOfBirth: String
        createdAt : String
        updatedAt : String
        qualification : String
        experience : String
        CourseAllocated : String
        address : String
        tickets : String
        email: String!
        password: String
        chatLogs : [String]
        course : String
        batch : String
      
 
    }
        union MentorUnion = Mentor | err

    `,
  query: `
        type Query {
            mentors:[Mentor]
            mentor(_id:String,createdAt:String):MentorUnion
        }
    `,
  mutation: `
        type Mutation {
            addMentor (input : MentorInput):GraphqlUnion
            updateMentor(updateID :String,update : MentorUpdate) : GraphqlUnion
            deleteMentor(updateID: String!):GraphqlUnion

        }
    `,
};

module.exports = typeDefs;
