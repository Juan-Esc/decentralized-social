CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`desoAddress` text,
	`body` text,
	`author_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`ethPubKey`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`ethPubKey` text PRIMARY KEY NOT NULL,
	`username` text,
	`desoPubKey` text,
	`name` text,
	`email` text,
	`created_at` integer
);
