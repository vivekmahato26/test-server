const { client, tickets, chatLogs,  mentor,
  student,
  user, } = require("../mongoDB");

const mongoDB = require("mongodb");

const date = new Date();

const resolvers = {
  Query: {
    tickets: async (_, args, { req }) => {
      // if (req.isAuth) {
      // if (req.userType == "admin" || !"employee" || !"student") {
      try {
        const data = await tickets.find({}).toArray();
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
      // } else {
      //   return new Error("user not Authorised");
      // }
      // } else {
      //   return new Error("user not logged in");
      // }
    },
    ticket: async (_, args, { req }) => {
      // if (req.userType == "admin" || !"employee" || !"student") {
      try {
        const id = new mongoDB.ObjectId(args._id);
        const data = await tickets.findOne({ _id: id });
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
      // }
    },
  },
  Mutation: {
    addTickets: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const result = await tickets.insertOne({
            ...args.input,
            createdAt: date.toISOString(),
          });
          const mentorId = new mongoDB.ObjectId(args.input.mentor);
          const mentorData = await mentor.updateOne(
            { _id: mentorId },
            { $push: { ticket: result.insertedId.toString() } }
          );
          const studentId = new mongoDB.ObjectId(args.input.student);
          const studentData = await student.updateOne(
            { _id: studentId },
            { $push: { ticket: result.insertedId.toString() } }
          );
          const userId = new mongoDB.ObjectId(req.userId);
          const userData = await user.updateOne(
            { _id: userId },
            { $push: { ticket: result.insertedId.toString() } }
          );
          return {
            msg: "data Added",
          };
        } catch (e) {
          return { err: JSON.stringify(e) };
        }
      } else {
        return {
          msg: "Please Login!!!",
        };
      }
    },
    updateTickets: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const id = new mongoDB.ObjectId(args.updateID);
          const data = await tickets.updateOne(
            { _id: id },
            { $set: { ...args.update, updatedAt: date.toISOString() } }
          );

          return {
            msg: "Tickets updated",
          };
        } catch (e) {
          console.log(e);
          return { err: JSON.stringify(e) };
        }
      } else {
        return {
          msg: "user not logged !!",
        };
      }
    },
    deleteChallenge: async (_, args, { req }) => {
      if (req.isAuth) {
        if ((req.userType = "admin")) {
          try {
            const id = new mongoDB.ObjectId(args.ticketID);
            const data = await tickets.deleteOne({ _id: id });

            return {
              msg: "Ticket deleted",
            };
          } catch (e) {
            console.log(e);
            return { err: JSON.stringify(e) };
          }
        } else {
          return {
            msg: "user not Authorised !!",
          };
        }
      } else {
        return {
          msg: "user not logged in",
        };
      }
    },
  },
  TicketUnion: {
    __resolveType(obj, context, info) {
      if (obj._id) {
        return "Tickets";
      }
      if (obj.err) {
        return "err";
      }
      return null;
    },
  },
  Tickets: {
    chatLogs: async (parent) => {
      let ids = parent.chatLogs;
      let res = [];

      if (ids) {
        for (const c of ids) {
          try {
            const id = new mongoDB.ObjectId(c);
            const data = await chatLogs.findOne({ _id: id });
            res.push(data);
          } catch (error) {
            return { err: JSON.stringify(error) };
          }
        }
      }
      return res;
    },
    student: async (parent) => {
      let ids = parent.student;
      let res;

      if (ids) {
        try {
          const id = new mongoDB.ObjectId(ids);
          const data = await student.findOne({ _id: id });
          res = data;
        } catch (error) {
          return { err: JSON.stringify(error) };
        }
      }
      return res;
    },
    mentor: async (parent) => {
      let ids = parent.mentor;
      let res;

      if (ids) {
        try {
          const id = new mongoDB.ObjectId(ids);
          const data = await mentor.findOne({ _id: id });
          res = data;
        } catch (error) {
          return { err: JSON.stringify(error) };
        }
      }
      return res;
    },
  },
};

module.exports = resolvers;
