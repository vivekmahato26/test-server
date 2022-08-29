const { client, resume } = require("../mongoDB");

const mongoDB = require("mongodb");

const date = new Date();

const resolvers = {
  Query: {
    resumes: async () => {
      try {
        const data = await resume.find({}).toArray();
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
    },
    resume: async (_, args) => {
      try {
        const id = new mongoDB.ObjectId(args._id);
        const data = await resume.findOne({ _id: id });
        return data;
      } catch (error) {
        return { err: JSON.stringify(error) };
      }
    },
  },
  Mutation: {
    addResume: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const result = await resume.insertOne({
            ...args.input,
            createdAt: date.toISOString(),
          });
          const studentId = new mongoDB.ObjectId(args.input.student);
          const studentData = await student.updateOne(
            { _id: studentId },
            { $push: { resume: result.insertedId.toString() } }
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
    updateResume: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const id = new mongoDB.ObjectId(args.updateID);
          const data = await resume.updateOne(
            { _id: id },
            { $set: { ...args.update, updatedAt: date.toISOString() } }
          );

          return {
            msg: "Resume updated",
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
    deleteResume: async (_, args, { req }) => {
      if (req.isAuth) {
        try {
          const id = new mongoDB.ObjectId(args.resumeID);
          const data = await resume.deleteOne({ _id: id });

          return {
            msg: "resume deleted",
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
  },
  Resumeunion: {
    __resolveType(obj, context, info) {
      if (obj._id) {
        return "Resume";
      }
      if (obj.err) {
        return "err";
      }
      return null;
    },},
    Resume:{
    student: async (parent) => {
      const ids = parent.student;

      let res = [];
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
  },
  };

module.exports = resolvers;
