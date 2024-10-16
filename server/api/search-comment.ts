import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { search } = query;

  if (!search) {
    return { error: 'Search term is required.' };
  }

  try {
    // Use Prisma's prepared statements via `findMany` with parameterized query
    const result = await prisma.guestbookEntry.findMany({
      where: {
        comment: {
          contains: search,  
          mode: 'insensitive'  
        }
      }
    });

    return result;
  } catch (e) {
    console.error('Error executing SQL query:', e);
    return { error: 'Error executing SQL query' };
  }
});

