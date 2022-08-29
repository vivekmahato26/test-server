const { OTP, student } = require("../mongoDB");
const mongoDB = require("mongodb");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { json } = require("express");
const date = new Date();

const resolvers = {
  Query: {
    otp: async (_, args, { req }) => {
      try {
        const data = await OTP.find({}).toArray();
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
    },
  },

  Mutation: {
    generateOtp: async (_, args) => {
      try {
        const OTp = Math.floor(Math.random(6) * 1000000 + 1).toString();
        const { phone } = args.input;
        const salt = await bcrypt.genSalt();

        const hash = await bcrypt.hash(OTp, salt);
        const Data = await OTP.findOne({ phone });
        console.log(OTp);
        if (!Data) {
          const data = await OTP.insertOne({
            ...args.input,
            otp: hash,
            expiry: "5min",
          });

          console.log(data);
          return {
            msg: "data Added",
          };
        } else {
          return { msg: "number exists" };
        }
      } catch (error) {
        console.log(error);
        return { err: JSON.stringify(error) };
      }
    },
    verifyOtp: async (_, args, { req }) => {
      try {
        const { phone } = args.input;
        const { otp } = args.input;

        const data = await OTP.findOne({ phone: args.input.phone });
        console.log(data);
        const storedOtp = data.otp;

        const compare = await bcrypt.compare(otp, storedOtp);

        if (compare) {
          await OTP.deleteOne({ _id: data._id });
          console.log(true);
          return { msg: "verified" };
        } else {
          console.log(false);
          return { msg: " not verified" };
        }
      } catch (error) {
        console.log(error);
        return { err: JSON.stringify(error) };
      }
    },
  },
};

module.exports = resolvers;
