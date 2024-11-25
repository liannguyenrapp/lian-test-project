import { NextRequest, NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    if (page < 1 || limit < 1) {
      return NextResponse.json({ error: 'Page and limit must be positive integers.' }, { status: 400 });
    }

    // Generate fake users
    const totalUsers = 1000; // Simulate a large dataset
    const users = Array.from({ length: totalUsers }, (_, index) => ({
      id: index + 1,
      name: faker.name.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
      address: faker.address.streetAddress(),
    }));

    // Paginate users
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);

    if (startIndex >= totalUsers) {
      return NextResponse.json({ error: 'Page exceeds total number of users.' }, { status: 404 });
    }

    return NextResponse.json({
      users: paginatedUsers,
      meta: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
