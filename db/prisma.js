// Starts a new prisma client in order to make queries to the database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;
