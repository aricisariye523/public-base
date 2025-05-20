const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getOverdueBorrows = async (req, res) => {
  const gecikenler = await prisma.borrow.findMany({
    where: {
      returnDate: null,
      borrowDate: {
        lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 gün
      },
    },
    include: { 
      user: true, 
      book: true 
    },
  });

  res.json(gecikenler);
};

exports.borrowBook = async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const book = await prisma.book.findUnique({ where: { id: bookId } });

  if (book.stock <= 0) return res.status(400).json({ error: "Stokta yok" });

  await prisma.borrow.create({
    data: {
      userId: req.user.userId,
      bookId,
    },
  });

  await prisma.book.update({
    where: { id: bookId },
    data: { stock: { decrement: 1 } },
  });

  res.json({ message: "Kitap ödünç alındı" });
};

exports.returnBook = async (req, res) => {
  const borrowId = parseInt(req.params.borrowId);
  const borrow = await prisma.borrow.update({
    where: { id: borrowId },
    data: { returnDate: new Date() },
    include: { book: true },
  });

  await prisma.book.update({
    where: { id: borrow.bookId },
    data: { stock: { increment: 1 } },
  });

  res.json({ message: "Kitap iade edildi" });
}; 