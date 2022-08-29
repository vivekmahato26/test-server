module.exports = {
  root: `
        type Otp {
            phone : String
            otp : String
            expiry : String
        }
        input OtpInput {
            phone : String
            otp : String
            expiry : String
        }

    `,
  query: `
        type Query {
            otp : [Otp]

        }
    `,
  mutation: `
    type Mutation {
        generateOtp(input : OtpInput): GraphqlUnion
        verifyOtp(input:OtpInput): GraphqlUnion
}`,
};
