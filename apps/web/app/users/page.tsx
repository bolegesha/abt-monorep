import { db } from '@repo/database';
import { users } from '@repo/database/src/schema';

export default async function UsersPage() {
  const usersList = await db.select().from(users);
  
  return (
    <ul>
      {usersList.map((user) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
} 