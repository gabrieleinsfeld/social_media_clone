// Starts a new prisma client in order to make queries to the database
const { PrismaClient } = require("@prisma/client");

const databaseUrl = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

module.exports = prisma;
