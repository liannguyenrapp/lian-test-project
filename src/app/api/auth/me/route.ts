/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Secret key for JWT (must match the one used for generating tokens)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(req: NextRequest) {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Respond with user information
    return NextResponse.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      },
    });
  } catch (error: any) {
    console.error('Error validating token:', error);

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token has expired.' }, { status: 401 });
    }

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}