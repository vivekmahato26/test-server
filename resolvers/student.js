const {
  client,
  student,
  subscription,
  tickets,
  jobApplications,
  batch,
  payment,
  challange,
  course,
  address,
  invoice,
  order,
  user,
  mentor,
  chatLogs,
} = require("../mongoDB");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const formData = require("formdata");
const mongoDB = require("mongodb");
// const passport = require("passport");
require("../middlewares/auth");

const date = new Date();

const resolvers = {
  Query: {
    students: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const id = new mongoDB.ObjectId(req.userId);
          const data = await student.find({ _id: id }).toArray();

          return data;
        } catch (error) {
          return { err: JSON.stringify(error) };
        }
      }
    },
    student: async (_, args, {req}) => {
      try {
        const id = new mongoDB.ObjectId(req.userId);
        console.log(req);
        const data = await student.findOne({ _id: id });
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
    },
  },

  Mutation: {
    addStudent: async (_, args, { req, res }) => {
      try {
        const { email } = args.input;
        const checkUser =
          (await student.findOne({ email })) ||
          (await mentor.findOne({ email }));
        console.log(args);
        if (checkUser) {
          // return new Error("Email already registered");
          try {
            console.log(checkUser);
            const id = checkUser._id;
            const data = await student.updateOne(
              { _id: id },
              {
                $set: {
                  token: args.input.token,
                  updatedAt: date.toISOString(),
                },
              }
            );
            console.log(data);
            return {
              msg: "student updated" || new Error("Email already registered"),
            };
          } catch (e) {
            console.log(e);
            return { err: JSON.stringify(e) };
          }
        } else {
          const { password } = args.input;
          const salt = await bcrypt.genSalt();

          // passport.authenticate("local");
          const hash = await bcrypt.hash(password, salt);

          const data = await student.insertOne({
            ...args.input,
            password: hash,
            createdAt: date.toISOString(),
          });
          console.log(data);
          return {
            msg: "data added",
          };
        }
      } catch (e) {
        console.log(e);
        return { err: JSON.stringify(e) };
      }
    },
    updateStudent: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const id = new mongoDB.ObjectId(req.userId);
          const data = await student.updateOne(
            { _id: id },
            { $set: { ...args.update, updatedAt: date.toISOString() } }
          );

          return {
            msg: "student updated",
          };
        } catch (e) {
          return { err: JSON.stringify(e) };
        }
      } else {
        return {
          msg: "user not logged !!",
        };
      }
    },
    updateProfilePic: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const id = new mongoDB.ObjectId(req.userId);
          const data = await student.updateOne(
            { _id: id },
            { $set: { image: args.url, updatedAt: date.toISOString() } }
          );

          return {
            msg: "student profile updated",
          };
        } catch (e) {
          return { err: JSON.stringify(e) };
        }
      } else {
        return {
          msg: "user not logged !!",
        };
      }
    },
  },
  StudentUnion: {
    __resolveType(obj, context, info) {
      if (obj._id) {
        return "Student";
      }
      if (obj.err) {
        return "err";
      }
      return null;
    },
  },

  Student: {
    address: async (parent) => {
      const ids = parent.address;
      let res = [];
      if (ids) {
        for (const c of ids) {
          try {
            const id = new mongoDB.ObjectId(ids);
            const data = await address.findOne({ _id: id });
            res = data;
          } catch (error) {
            return { err: JSON.stringify(error) };
          }
        }
      }
      return res;
    },

    course: async (parent) => {
      const ids = parent.course;
      let res = [];
      for (const c of ids) {
        if (ids) {
          try {
            const id = new mongoDB.ObjectId(c);
            const data = await course.findOne({ _id: id });
            res.push(data);
          } catch (error) {
            return { err: JSON.stringify(error) };
          }
        }
      }
      return res;
    },
    subscription: async (parent) => {
      const ids = parent.subscription;
      let res = [];
      if (ids) {
        // for (const c of ids) {
        try {
          const id = new mongoDB.ObjectId(ids);
          const data = await subscription.findOne({ _id: id });
          res = data;
        } catch (error) {
          return { err: JSON.stringify(error) };
          // }
        }
      }
      return res;
    },
    tickets: async (parent) => {
      const ids = parent.tickets;
      let res = [];
      if (ids) {
        for (const c of ids) {
          try {
            const id = new mongoDB.ObjectId(c);
            const data = await tickets.findOne({ _id: id });
            res.push(data);
          } catch (error) {
            return { err: JSON.stringify(error) };
          }
        }
      }
      return res;
    },
    payments: async (parent) => {
      const ids = parent.payments;
      let res;
      if (ids) {
        try {
          const id = new mongoDB.ObjectId(ids);
          const data = await payment.findOne({ _id: id });
          res = data;
        } catch (error) {
          return { err: JSON.stringify(error) };
        }
      }
      return res;
    },

    orders: async (parent) => {
      const orderIds = parent.orders;
      let res = [];
      if (orderIds) {
        // for (const c of orderIds) {
        try {
          const id = new mongoDB.ObjectId(orderIds);
          const data = await order.findOne({ _id: id });
          res.push(data);
        } catch (error) {
          return { err: JSON.stringify(error) };
        }
        // }
      }
      return res;
    },
    jobApp: async (parent) => {
      const jobAppIds = parent.jobApp;
      let res = [];
      if (jobAppIds) {
        // for (const c of jobAppIds) {
        try {
          const id = new mongoDB.ObjectId(jobAppIds);
          const data = await jobApplications.findOne({ _id: id });
          res = data;
        } catch (error) {
          return {
            err: JSON.stringify(error),
            // };
          };
        }
      }
      return res;
    },

    // challanges: async (parent) => {
    //   const ids = parent.challanges;
    //   let res = [];
    //   if (ids) {
    //     // for (const c of ids) {
    //     try {
    //       const id = new mongoDB.ObjectId(ids);
    //       const data = await challange.findOne({ _id: id });
    //       res = data;
    //     } catch (error) {
    //       return { err: JSON.stringify(error) };
    //     }
    //     // }
    //   }
    //   return res;
    // },

    batch: async (parent) => {
      const ids = parent.batch;
      let res = [];
      if (ids) {
        for (const c of ids) {
          try {
            const id = new mongoDB.ObjectId(c);
            const data = await batch.findOne({ _id: id });
            res.push(data);
          } catch (error) {
            return { err: JSON.stringify(error) };
          }
        }
      }
      return res;
    },

    invoice: async (parent) => {
      const ids = parent.invoice;
      let res;
      if (ids) {
        // for (const c of ids) {
        try {
          const id = new mongoDB.ObjectId(ids);
          const data = await invoice.findOne({ _id: id });
          res = data;
        } catch (error) {
          return { err: JSON.stringify(error) };
        }
        // }
      }
      return res;
    },
    chats: async (parent) => {
      const ids = parent.chats;
      let res = [];
      if (ids) {
        for (const c of ids) {
          try {
            const id = new mongoDB.ObjectId(ids);
            const data = await chatLogs.findOne({ _id: id });
            res = data;
          } catch (error) {
            return { err: JSON.stringify(error) };
          }
        }
      }
      return res;
    },
  },
};

module.exports = resolvers;
