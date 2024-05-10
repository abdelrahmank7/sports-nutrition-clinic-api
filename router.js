// router.js
const express = require('express');
const router = express.Router();
const { createUserTable, getUserByIdAndPassword, storeUser } = require('./database');

router.post('/signin', async (req, res) => {
    const { id, password } = req.body;
    try {
      const user = await getUserByIdAndPassword(id, password);
      if (!user) {
        res.status(401).send({ error: 'Invalid credentials' });
      } else {
        res.json({ id: user.id });
        // Redirect to ClientHomePage
        res.redirect('/ClientHomePage');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Error signing in' });
    }
  });

  
router.post('/signup', async (req, res) => {
  const { id, password } = req.body;
  try {
    await createUserTable();
    await storeUser(id, password);
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error creating user' });
  }
});

module.exports = router;