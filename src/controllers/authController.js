const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

// Email gönderici yapılandırması
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: "Kayıt başarılı" });
  } catch (error) {
    res.status(400).json({ error: "Kayıt başarısız" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Hatalı şifre" });

  const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({ token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

  const resetToken = uuidv4();
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 saat

  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry
    }
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Şifre Sıfırlama',
    html: `
      <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Bu link 1 saat sonra geçerliliğini yitirecektir.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi" });
  } catch (error) {
    res.status(500).json({ error: "E-posta gönderilemedi" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() }
    }
  });

  if (!user) return res.status(400).json({ error: "Geçersiz veya süresi dolmuş token" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  });

  res.json({ message: "Şifreniz başarıyla güncellendi" });
}; 