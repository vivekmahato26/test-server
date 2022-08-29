const { client, messages, chatLogs,user,
  student,
  mentor, } = require("../mongoDB");

const mongoDB = require("mongodb");
const { uuid } = require("uuidv4");

const date = new Date();
const resolvers = {
  Query: {
    messages: async () => {
      try {
        const data = await messages.find({}).toArray();
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
    },
    message: async (_, args) => {
      try {
        const id = new mongoDB.ObjectId(args._id);
        const data = await messages.findOne({ _id: id });
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
    },
  },

  Mutation: {
    addMessage: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const result = await messages.insertOne({
            emoji: args.input.emoji,
            files: args.input.files,
            message: args.input.Message,
            senderId: req.userId,
            receiverId: args.input.receiverId,
            createdAt: date.toISOString(),
          });

          const userId = new mongoDB.ObjectId(req.userId);
          const receiverId = new mongoDB.ObjectId(args.input.receiverId);

          const chatlogId = args.input.chatlogId;

          console.log(chatlogId);
          if (chatlogId) {
            const clogId = new mongoDB.ObjectId(chatlogId);
            const updatedChatLog = await chatLogs.updateOne(
              { _id: clogId },
              { $push: { messages: result.insertedId.toString() } }
            );
          } else {
            const newChatLog = await chatLogs.insertOne({
              receiverId: args.input.receiverId,
              senderId: req.userId,
              messages: [result.insertedId.toString()],
            });
            console.log(req);
            if (req.userType === "student") {
              console.log(newChatLog);
              const updateSender = await student.updateOne(
                { _id: userId },
                { $push: { chatLogs: result.insertedId.toString() } }
              );
              const updateReceiver = await mentor.updateOne(
                { _id: receiverId },
                { $push: { chatLogs: result.insertedId.toString() } }
              );
              console.log(updateReceiver);
            }
            if (req.userType === "mentor") {
              const updateReceiver = await student.updateOne(
                { _id: receiverId },
                { $push: { chatLogs: result.insertedId.toString() } }
              );
              const updatesender = await mentor.updateOne(
                { _id: userId },
                { $push: { chatLogs: result.insertedId.toString() } }
              );
            }
            if (args.input.receiverType === "student") {
              const updateSender = await student.updateOne(
                { _id: receiverId },
                { $push: { chatLogs: result.insertedId.toString() } }
              );
              const updateReceiver = await student.updateOne(
                { _id: userId },
                { $push: { chatLogs: result.insertedId.toString() } }
              );
            }
          }

          return {
            msg: "data added",
          };
        } catch (error) {
          console.log(error)
          return {
            err: JSON.stringify(error),
          };
        }
      } else {
        return new Error("please login");
      }
    },
    addFiles: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const id = new mongoDB.ObjectId(req.userId);
          const data = await messages.insertOne(
            { _id: id },
            { $set: { files: args.url, updatedAt: date.toISOString() } }
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
    updateMessage: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const id = new mongoDB.ObjectId(args.updateID);
          const data = await messages.updateOne(
            { _id: id },
            {
              $set: {
                emoji: args.input.emoji,
                files: args.input.files,
                message: args.input.Message,
                updatedAt: date.toISOString(),
              },
            }
          );

          return {
            msg: "messages updated",
          };
        } catch (err) {
          return { err: JSON.stringify(err) };
        }
      } else {
        return {
          msg: "user not logged !!",
        };
      }
    },
    deleteMessage: async (_, args, { req }) => {
      console.log(args);
      if (req.isAuth) {
        if (req.userType == "admin") {
          try {
            const id = new mongoDB.ObjectId(args.messageID);
            const data = await messages.deleteOne({ _id: id });

            return {
              msg: "messages deleted",
            };
          } catch (err) {
            return { err: JSON.stringify(err) };
          }
        } else {
          return new Error("User not Authorised to delete this message");
        }
      } else {
        return new Error("user not logged in please login");
      }
    },
  },
  MessageUnion: {
    __resolveType(obj, context, info) {
      if (obj._id) {
        return "Messages";
      }
      if (obj.err) {
        return "err";
      }
      return null;
    },
  },
  Messages: {
    chatLogs: async (parent) => {
      let ids = parent.chatLogs;
      let res;

      if (ids) {
        try {
          const id = new mongoDB.ObjectId(ids);
          const data = await chatLogs.findOne({ _id: id });
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
