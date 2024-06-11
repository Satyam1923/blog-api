import express from "express";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import serviceAccount from "./blog-post-d2781-firebase-adminsdk-nuoh5-3f12f39d53.json" assert { type: 'json' };

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const jwtSecret = process.env.JWT_SECRET;
const db = admin.firestore();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT;

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
    res.send('Welcome to the Blog Post API!');
  });
  
app.post('/posts', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newPost = {
    title,
    content,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await db.collection('posts').add(newPost);
    res.status(201).json({ id: docRef.id, ...newPost });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.get('/posts',authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('posts').get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

app.get('/posts/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection('posts').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
});

app.put('/posts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const postRef = db.collection('posts').doc(id);
    const doc = await postRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await postRef.update({ title, content });
    res.status(200).json({ id, title, content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.delete('/posts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const postRef = db.collection('posts').doc(id);
    const doc = await postRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await postRef.delete();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.post('/token', (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    const user = { username };
    const token = jwt.sign(user, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
