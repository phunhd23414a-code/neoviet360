const prisma = require("./src/config/prisma");
const bcrypt = require("bcryptjs");

async function test() {
  const user = await prisma.user.findUnique({ where: { email: "admin@neoviet360.vn" } });
  console.log("User found:", !!user);
  console.log("Has passwordHash:", !!user?.passwordHash);
  console.log("PasswordHash length:", user?.passwordHash?.length);
  
  if (user?.passwordHash) {
    const ok = await bcrypt.compare("password123", user.passwordHash);
    console.log("Password match:", ok);
  }
  
  // Re-hash and update
  const newHash = await bcrypt.hash("password123", 10);
  await prisma.user.update({
    where: { email: "admin@neoviet360.vn" },
    data: { passwordHash: newHash }
  });
  console.log("Password re-hashed");
  
  // Test again
  const user2 = await prisma.user.findUnique({ where: { email: "admin@neoviet360.vn" } });
  const ok2 = await bcrypt.compare("password123", user2.passwordHash);
  console.log("New password match:", ok2);
  
  await prisma.$disconnect();
}

test().catch(console.error);