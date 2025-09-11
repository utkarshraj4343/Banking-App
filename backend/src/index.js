import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5"; // Import from the new package
import mongoose from "mongoose";
import dotenv from "dotenv";
import accountRoutes from "./routes/accountRoutes.js"; //  Import the account routes
import loanRoutes from './routes/loanRoutes.js';
// import cors from "cors";
import { typeDefs, resolvers } from "./graphql/schema.js";
import { authMiddleware } from './middleware/auth.js'
// Load env variables
dotenv.config();

const app = express();

// Global middleware to parse JSON bodies for all routes
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  // Start the Apollo Server before Express begins using it
  await server.start();

  // ***** Start of temporary test route code *****
  // This is a simple test endpoint to check your authMiddleware
  app.get("/api/test-auth", authMiddleware, (req, res) => {
    if (req.user) {
      res.status(200).json({
        message: "Authentication successful!",
        user: req.user,
      });
    } else {
      res.status(401).json({
        message: "Authentication failed. Token is invalid or missing.",
      });
    }
  });
  // ***** End of temporary test route code *****
 // Integrate the account REST API routes
    app.use("/api/accounts", accountRoutes);
    app.use('/api/loans', loanRoutes);

  // Use expressMiddleware to integrate Apollo Server with Express
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        authMiddleware(req, res, () => { });
        return { user: req.user };
      },
    })
  );

  // MongoDB connection and server start
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
      const PORT = process.env.PORT || 4000;
      app.listen(PORT, () => {
        console.log(` Server ready at http://localhost:${PORT}/graphql`);
      });
    })
    .catch(err => console.error("MongoDB error:", err));
};

startServer();