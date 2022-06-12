const router = require('express').Router();

const verifyRoutes = require('./verify.routes');

router.get('/', (req, res, next) => {
  res.json('All good in here');
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

router.use('/verify', verifyRoutes);

module.exports = router;
