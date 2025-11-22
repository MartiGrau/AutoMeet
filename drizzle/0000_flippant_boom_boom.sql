CREATE TABLE `integration_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`api_key` text NOT NULL,
	`email_config` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `labels` (
	`id` text PRIMARY KEY NOT NULL,
	`meeting_id` text NOT NULL,
	`tag_name` text NOT NULL,
	FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text DEFAULT 'Untitled Meeting' NOT NULL,
	`audio_url` text,
	`transcript` text,
	`summary` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`preferences` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);