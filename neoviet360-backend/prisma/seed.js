const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Hash password for default login user
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create default login user
  const user = await prisma.user.upsert({
    where: { email: "admin@neoviet360.vn" },
    update: {},
    create: {
      email: "admin@neoviet360.vn",
      passwordHash: passwordHash,
      name: "Nguyễn Văn Demo",
      provider: "LOCAL",
      kycStatus: "VERIFIED"
    }
  });

  // Create accounts
  const accounts = await Promise.all([
    prisma.account.upsert({
      where: { id: "acc-main-001" },
      update: {},
      create: {
        id: "acc-main-001",
        userId: user.id,
        type: "CHECKING",
        name: "Tài khoản chính",
        balance: 147500000,
        currency: "VND",
        accountNumber: "1234567890",
        isDefault: true
      }
    }),
    prisma.account.upsert({
      where: { id: "acc-savings-001" },
      update: {},
      create: {
        id: "acc-savings-001",
        userId: user.id,
        type: "SAVINGS",
        name: "Tài khoản tiết kiệm",
        balance: 50000000,
        currency: "VND",
        accountNumber: "0987654321",
        isDefault: false
      }
    })
  ]);

  // Create sample transactions
  const categories = ["FOOD", "TRANSPORT", "SHOPPING", "ENTERTAINMENT", "BILLS", "HEALTH", "EDUCATION"];
  const transactions = [];
  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    transactions.push({
      userId: user.id,
      fromAccountId: accounts[0].id,
      toAccountId: null,
      amount: Math.floor(Math.random() * 500000) + 50000,
      currency: "VND",
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `Giao dịch mẫu #${i + 1}`,
      type: "EXPENSE",
      status: "COMPLETED",
      createdAt: date
    });
  }
  await prisma.transaction.createMany({ data: transactions, skipDuplicates: true });

  // Create budgets
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: "FOOD", limitAmount: 10000000, period: "MONTHLY", startDate: monthStart, endDate: monthEnd },
      { userId: user.id, category: "TRANSPORT", limitAmount: 3000000, period: "MONTHLY", startDate: monthStart, endDate: monthEnd },
      { userId: user.id, category: "SHOPPING", limitAmount: 5000000, period: "MONTHLY", startDate: monthStart, endDate: monthEnd }
    ],
    skipDuplicates: true
  });

  // Create savings goals
  await prisma.savingsGoal.createMany({
    data: [
      { userId: user.id, accountId: accounts[1].id, name: "Mua nhà", targetAmount: 500000000, currentAmount: 170000000, deadline: new Date("2027-12-31") },
      { userId: user.id, accountId: accounts[1].id, name: "Du lịch Nhật Bản", targetAmount: 80000000, currentAmount: 45000000, deadline: new Date("2026-06-30") }
    ],
    skipDuplicates: true
  });

  // Create cards
  await prisma.card.createMany({
    data: [
      { userId: user.id, accountId: accounts[0].id, cardNumber: "4111111111111111", type: "DEBIT", limitAmount: 50000000, isFrozen: false, expiresAt: new Date("2028-12-31") },
      { userId: user.id, accountId: accounts[0].id, cardNumber: "5500000000000004", type: "CREDIT", limitAmount: 100000000, isFrozen: false, expiresAt: new Date("2027-06-30") }
    ],
    skipDuplicates: true
  });

  // Create bills
  await prisma.bill.createMany({
    data: [
      { userId: user.id, name: "Tiền điện", amount: 450000, category: "UTILITIES", dueDate: new Date("2026-06-25"), isRecurring: true, status: "PENDING" },
      { userId: user.id, name: "Tiền nước", amount: 180000, category: "UTILITIES", dueDate: new Date("2026-06-20"), isRecurring: true, status: "PENDING" },
      { userId: user.id, name: "Internet FPT", amount: 250000, category: "UTILITIES", dueDate: new Date("2026-06-15"), isRecurring: true, status: "PENDING" }
    ],
    skipDuplicates: true
  });

  // Create rewards
  await prisma.reward.createMany({
    data: [
      { userId: user.id, points: 150, type: "EARN", description: "Welcome bonus", createdAt: new Date() },
      { userId: user.id, points: 50, type: "EARN", description: "Transfer reward", createdAt: new Date() },
      { userId: user.id, points: -20, type: "ADJUST", description: "Correction", createdAt: new Date() }
    ],
    skipDuplicates: true
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { userId: user.id, type: "SYSTEM", title: "Chào mừng", message: "Chào mừng bạn đến với NeoViet 360!", isRead: false },
      { userId: user.id, type: "REWARD", title: "Nhận thưởng", message: "Bạn đã nhận được 50 NeoPoints từ giao dịch!", isRead: false },
      { userId: user.id, type: "SECURITY", title: "Đăng nhập mới", message: "Phát hiện đăng nhập từ thiết bị mới", isRead: false },
      { userId: user.id, type: "BUDGET", title: "Cảnh báo ngân sách", message: "Bạn đã chi tiêu 80% ngân sách tháng này", isRead: false }
    ],
    skipDuplicates: true
  });

  console.log("Seed completed! Default user: admin@neoviet360.vn / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());