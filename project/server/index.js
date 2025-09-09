import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;

// In-memory storage (replace with MongoDB in production)
const clipboards = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Generate unique 6-character code
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (clipboards.has(code));
  return code;
}

// Clean expired clipboards
function cleanExpiredClipboards() {
  const now = new Date();
  for (const [code, clipboard] of clipboards.entries()) {
    if (clipboard.expiresAt && clipboard.expiresAt <= now) {
      clipboards.delete(code);
    }
  }
}

// Run cleanup every minute
setInterval(cleanExpiredClipboards, 60000);

// Create clipboard
app.post('/api/clipboard', async (req, res) => {
  try {
    const { content, password, expiryMinutes, burnAfterReading } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const id = uuidv4();
    const code = generateCode();
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    
    let expiresAt = null;
    if (expiryMinutes && expiryMinutes > 0) {
      expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    }

    const clipboard = {
      id,
      code,
      content,
      hasPassword: !!password,
      password: hashedPassword,
      expiresAt,
      burnAfterReading: !!burnAfterReading,
      createdAt: new Date(),
      viewCount: 0
    };

    clipboards.set(code, clipboard);

    res.json({
      code,
      hasPassword: clipboard.hasPassword,
      expiresAt: clipboard.expiresAt,
      burnAfterReading: clipboard.burnAfterReading
    });
  } catch (error) {
    console.error('Error creating clipboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get clipboard
app.post('/api/clipboard/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { password } = req.body;

    cleanExpiredClipboards();

    const clipboard = clipboards.get(code.toUpperCase());
    if (!clipboard) {
      return res.status(404).json({ error: 'Clipboard not found or expired' });
    }

    // Check password if required
    if (clipboard.hasPassword) {
      if (!password) {
        return res.status(401).json({ error: 'Password required' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, clipboard.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    // Increment view count
    clipboard.viewCount++;

    // Handle burn after reading
    if (clipboard.burnAfterReading && clipboard.viewCount === 1) {
      const content = clipboard.content;
      clipboards.delete(code.toUpperCase());
      return res.json({
        content,
        burned: true,
        expiresAt: null,
        createdAt: clipboard.createdAt
      });
    }

    res.json({
      content: clipboard.content,
      burned: false,
      expiresAt: clipboard.expiresAt,
      createdAt: clipboard.createdAt
    });
  } catch (error) {
    console.error('Error retrieving clipboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get clipboard info (without content)
app.get('/api/clipboard/:code/info', (req, res) => {
  try {
    const { code } = req.params;
    
    cleanExpiredClipboards();

    const clipboard = clipboards.get(code.toUpperCase());
    if (!clipboard) {
      return res.status(404).json({ error: 'Clipboard not found or expired' });
    }

    res.json({
      hasPassword: clipboard.hasPassword,
      expiresAt: clipboard.expiresAt,
      burnAfterReading: clipboard.burnAfterReading,
      createdAt: clipboard.createdAt
    });
  } catch (error) {
    console.error('Error getting clipboard info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});