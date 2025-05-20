const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBooks = async (req, res) => {
  const { author, category, title } = req.query;
  
  const books = await prisma.book.findMany({
    where: {
      AND: [
        author ? { author: { contains: author, mode: 'insensitive' } } : {},
        category ? { category: { contains: category, mode: 'insensitive' } } : {},
        title ? { title: { contains: title, mode: 'insensitive' } } : {}
      ]
    }
  });
  
  res.json(books);
};

exports.createBook = async (req, res) => {
  const { title, author, category, stock } = req.body;
  const book = await prisma.book.create({ 
    data: { title, author, category, stock } 
  });
  res.json(book);
};

exports.updateBook = async (req, res) => {
  const { title, author, category, stock } = req.body;
  const book = await prisma.book.update({
    where: { id: parseInt(req.params.id) },
    data: { title, author, category, stock },
  });
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  await prisma.book.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Silindi" });
}; 