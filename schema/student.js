module.exports = {
  root: ` 
  type Student {
    _id: String
    firstName: String
    userName : String
    lastName: String
    phone: String
    email: String!
    image : String
    password: String!
    gender : String
    address: Address
    dob: String
    createdAt : String
    updatedAt : String
    course: [Course]
    batch : [Batch]
    subscription: Subscription
    invoice : Invoice
    tickets: [Tickets]
    payments: Payment
    orders: [Order]
    jobApp: JobApp
    challenges: Challenge
    chats : [ChatLogs]
    token:String
    otp : String

}
        
input StudentInput {
    firstName: String
    userName : String
    lastName: String
    image : String
    phone: String
    email: String!
    password: String
    gender : String
    dob: String
    address: String
    course : [String]
    orders: [String]
    tickets: [String]
    chats : [String]
    otp : String
    token: String

}

input StudentUpdate {
    firstName: String
    userName : String
    lastName: String
    image : String
    phone: String
    password: String
    gender : String
    dob: String
    address: String
    course: [String]
    batch : [String]
    subscription: String
    invoice : String
    tickets: [String]
    payments: String
    orders: [String]
    jobApp: String
    challanges: String
    chats : [String]
    otp : String


}
        union StudentUnion = Student | err
        `,
  query: `
            type Query {
                students: [Student]
                student:StudentUnion 
        }`,
  mutation: `
            type Mutation {
                addStudent(input:StudentInput): GraphqlUnion
                updateStudent(updateID:String,update:StudentUpdate): GraphqlUnion
                updateProfilePic(url:String,userType:String):GraphqlUnion
                deleteStudent(updateID: String!):GraphqlUnion
                
        }`,
};
