const { client, chatLogs, messages, tickets, student, mentor } = require("../mongoDB");

const mongoDB = require("mongodb");

const date = new Date();
const resolvers = {
  Query: {
    chatlogs: async () => {
      try {
        const data = await chatLogs.find({}).toArray();
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
    },
    chatlog: async (_, args) => {
      try {
        const id = new mongoDB.ObjectId(args._id);
        const data = await chatLogs.findOne({ _id: id });
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
    },
  },
  Mutation: {
    addChatLogs: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const result = await chatLogs.insertOne({
            ...args.input,
            createdAt: date.toISOString(),
          });
          const ticketId = new mongoDB.ObjectId(args.input.tickets);
          const ticketData = await tickets.updateOne(
            { _id: ticketId },
            { $push: { chatLogs: result.insertedId.toString() } }
          );

          const studentId = new mongoDB.ObjectId(req.userId);
          const studentData = await student.updateOne(
            { _id: studentId },
            { $push: { chatLogs: result.insertedId.toString() } }
          );
          const mentorId = new mongoDB.ObjectId(req.userId);
          const mentorData = await mentor.updateOne(
            { _id: mentorId },
            { $push: { chatLogs: result.insertedId.toString() } }
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
  },
  ChatLogsUnion: {
    __resolveType(obj, context, info) {
      if (obj._id) {
        return "ChatLogs";
      }
      if (obj.err) {
        return "err";
      }
      return null;
    },
  },

  ChatLogs: {
    messages: async (parent) => {
      let ids = parent.Messages;
      let res = [];

      if (ids) {
        for (const c of ids) {
          try {
            const id = new mongoDB.ObjectId(c);
            const data = await messages.findOne({ _id: id });
            res.push(data);
          } catch (error) {
            return { err: JSON.stringify(error) };
          }
        }
      }
      return res;
    },
    ticket: async (parent) => {
      let ids = parent.ticket;
      let res = [];

      if (ids) {
        try {
          const id = new mongoDB.ObjectId(ids);
          const data = await tickets.findOne({ _id: id });
          res.push(data);
        } catch (error) {
          return { err: JSON.stringify(error) };
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
          res= data;
        } catch (error) {
          return { err: JSON.stringify(error) };
        }
      }
      return res;
    },
  },

};

module.exports = resolvers;
