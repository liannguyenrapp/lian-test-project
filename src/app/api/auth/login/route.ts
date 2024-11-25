import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user database
const users = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123', // In production, use hashed passwords!
    name: 'John Doe',
  },
];

// Secret key for JWT (store securely in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Authenticate user
    const user = users.find(
      (u) => u.email === email && u.password === password // Replace with proper hash comparison in production
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Set expiration
    );

    // Respond with JWT
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
