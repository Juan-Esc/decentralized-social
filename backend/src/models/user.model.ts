import { relations } from "drizzle-orm";
import { int, sqliteTable, text, foreignKey, integer } from "drizzle-orm/sqlite-core";
import { id } from "ethers";

export const users = sqliteTable("users", {
    ethPubKey: text("ethPubKey")
        .notNull()
        .primaryKey(),
    username: text("username"),
    desoPubKey: text("desoPubKey"),
    name: text("name"),
    email: text("email"),
    created_at: int("created_at", { mode: "timestamp" }).$default(
        () => new Date()
    ),
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));

export const posts = sqliteTable("posts", {
    id: integer("id").primaryKey(),
    desoAddress: text("desoAddress"), // DeSo Post Public Key where post is stored
    body: text("body"),
    authorId: text("author_id").notNull().references(() => users.ethPubKey, { onDelete: 'cascade' }), // foreign key
    created_at: int("created_at", { mode: "timestamp" }).$default(
        () => new Date()
    ),
});

export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.ethPubKey],
        relationName: "author",
    }),
}));