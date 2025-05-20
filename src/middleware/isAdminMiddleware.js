module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
  }
  next();
}; 