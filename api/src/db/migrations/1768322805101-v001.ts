import { MigrationInterface, QueryRunner } from "typeorm";

export class V0011768322805101 implements MigrationInterface {
    name = 'V0011768322805101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "apiKey" character varying NOT NULL, "expiryDate" TIMESTAMP, "origin" character varying NOT NULL, "scope" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('draft', 'published')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "shortDescription" text NOT NULL, "fullDescription" text NOT NULL, "content" jsonb NOT NULL DEFAULT '[]', "thumbnailUrl" character varying NOT NULL, "images" text, "technologies" text NOT NULL, "liveUrl" character varying, "githubUrl" character varying, "featured" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', "seoTitle" character varying, "seoDescription" text, "seoKeywords" character varying, "status" "public"."projects_status_enum" NOT NULL DEFAULT 'draft', "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_96e045ab8b0271e5f5a91eae1ee" UNIQUE ("slug"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tags_type_enum" AS ENUM('project', 'blog', 'both')`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "type" "public"."tags_type_enum" NOT NULL DEFAULT 'both', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "UQ_b3aa10c29ea4e61a830362bd25a" UNIQUE ("slug"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'editor')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying, "password" character varying NOT NULL, "name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'editor', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE TYPE "public"."blogs_status_enum" AS ENUM('draft', 'published')`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying, "excerpt" text, "content" jsonb NOT NULL DEFAULT '[]', "featuredImage" character varying, "author_id" uuid NOT NULL, "readingTime" integer NOT NULL DEFAULT '5', "views" integer NOT NULL DEFAULT '0', "featured" boolean NOT NULL DEFAULT false, "seoTitle" character varying, "seoDescription" text, "seoKeywords" character varying, "status" "public"."blogs_status_enum" NOT NULL DEFAULT 'draft', "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7" UNIQUE ("slug"), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying NOT NULL, "company" character varying NOT NULL, "location" character varying, "period" character varying NOT NULL, "responsibilities" text array NOT NULL, "achievements" text array NOT NULL, "technologies" text array NOT NULL, "order" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_884f0913a63882712ea578e7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" jsonb NOT NULL, "description" text, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, "mimeType" character varying, "size" bigint, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_tags" ("project_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_df0765dfc14c4d3e39cb79406f9" PRIMARY KEY ("project_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc13802855877d708af05b585a" ON "project_tags" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d0f9955e703904ce2245a2738" ON "project_tags" ("tag_id") `);
        await queryRunner.query(`CREATE TABLE "blog_tags" ("blog_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_561e9296a2ba753a9900831104c" PRIMARY KEY ("blog_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_20ce3565a4dda1ce7a3e8104f2" ON "blog_tags" ("blog_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7d8cc813269fa2a0ec3f857187" ON "blog_tags" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_b324119dcb71e877cee411f7929" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_tags" ADD CONSTRAINT "FK_bc13802855877d708af05b585ad" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_tags" ADD CONSTRAINT "FK_1d0f9955e703904ce2245a2738a" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_20ce3565a4dda1ce7a3e8104f2a" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876"`);
        await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_20ce3565a4dda1ce7a3e8104f2a"`);
        await queryRunner.query(`ALTER TABLE "project_tags" DROP CONSTRAINT "FK_1d0f9955e703904ce2245a2738a"`);
        await queryRunner.query(`ALTER TABLE "project_tags" DROP CONSTRAINT "FK_bc13802855877d708af05b585ad"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_b324119dcb71e877cee411f7929"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d8cc813269fa2a0ec3f857187"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20ce3565a4dda1ce7a3e8104f2"`);
        await queryRunner.query(`DROP TABLE "blog_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d0f9955e703904ce2245a2738"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc13802855877d708af05b585a"`);
        await queryRunner.query(`DROP TABLE "project_tags"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "experiences"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TYPE "public"."blogs_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TYPE "public"."tags_type_enum"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "api_keys"`);
    }

}
