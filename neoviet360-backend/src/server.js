const app = require("./app");
const prisma = require("./config/prisma");

const port = Number(process.env.PORT || 3001);

const server = app.listen(port, () => {
  console.log(`NeoViet 360 backend running on http://localhost:${port}`);
});

const shutdown = async () => {
  console.log("Shutting down NeoViet 360 backend...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);