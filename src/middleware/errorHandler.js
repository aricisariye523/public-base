module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Doğrulama hatası',
      details: err.message
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Geçersiz token'
    });
  }

  res.status(500).json({
    error: 'Sunucu hatası',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Bir şeyler yanlış gitti'
  });
}; 