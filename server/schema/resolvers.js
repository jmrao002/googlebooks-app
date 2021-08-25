const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // add context to the query to retrieve the logged in user without needing to search for them
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({})
          .select("-__v -password")
          .populate("books");

        return userData;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const profile = await User.findOne({ email });

      if (!profile) {
        throw new AuthenticationError("No profile with this email found!");
      }

      const correctPassword = await profile.isCorrectPassword(correctPassword);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password");
      }

      const token = signToken(profile);
      return { token, profile };
    },

    addUser: async (parent, args) => {
      const profile = await User.create(args);
      const token = signToken(profile);

      return { token, profile };
    },

    // third argument to access data in the context
    saveBook: async (parent, { bookInput }, context) => {
      if (context.user) {
        const updatedProfile = await User.findOneAndUpdate(
          { _id: context.profile._id },
          { $addToSet: { savedBooks: bookInput } },
          { new: true }
        );
        return updatedProfile;
      }
      // if trying to save a book when not logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedProfile = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      // if trying to remove a book when not logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
