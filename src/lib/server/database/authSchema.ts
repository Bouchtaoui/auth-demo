import { sqliteTable, text, blob, integer } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	email: text('username').notNull().unique(),
	admin: integer('admin', { mode: 'boolean' }).notNull().default(false),
	hashedPassword: text('hashed_password').notNull()
});

export const sessionTable = sqliteTable('user_session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull()
});

