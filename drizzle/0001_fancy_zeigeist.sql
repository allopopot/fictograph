CREATE TABLE "book" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "book_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text,
	"key" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL,
	"image_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_image_id_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;