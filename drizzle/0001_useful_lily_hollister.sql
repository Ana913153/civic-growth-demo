CREATE TABLE `email_signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`consent` boolean NOT NULL DEFAULT true,
	`source` varchar(64) NOT NULL DEFAULT 'homepage',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_signups_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_signups_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` varchar(16) NOT NULL DEFAULT 'user';