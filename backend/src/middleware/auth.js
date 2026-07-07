const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const orgOwnerMiddleware = (req, res, next) => {
  if (req.userRole !== 'org_owner' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Organization owner access required' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  orgOwnerMiddleware,
};
