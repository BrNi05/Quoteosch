import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1759670073877 implements MigrationInterface {
    name = 'InitTables1759670073877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lecturer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "shortName" varchar NOT NULL, "fullName" varchar NOT NULL, "lastModifiedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fb535eb9b855e02bce3ada01f51" UNIQUE ("shortName"))`);
        await queryRunner.query(`CREATE TABLE "quote" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "lastModifiedAt" datetime NOT NULL DEFAULT (datetime('now')), "lecturerId" integer)`);
        await queryRunner.query(`CREATE TABLE "contribute_quote" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "lastModifiedAt" datetime NOT NULL DEFAULT (datetime('now')), "lecturerId" integer)`);
        await queryRunner.query(`CREATE TABLE "contribute_lecturer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "shortName" varchar NOT NULL, "fullName" varchar NOT NULL, "lastModifiedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_77cdfc80c0fb2d16772654569fe" UNIQUE ("shortName"))`);
        await queryRunner.query(`CREATE TABLE "temporary_quote" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "lastModifiedAt" datetime NOT NULL DEFAULT (datetime('now')), "lecturerId" integer, CONSTRAINT "FK_93906f6eea60640a05e106e5682" FOREIGN KEY ("lecturerId") REFERENCES "lecturer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_quote"("id", "content", "lastModifiedAt", "lecturerId") SELECT "id", "content", "lastModifiedAt", "lecturerId" FROM "quote"`);
        await queryRunner.query(`DROP TABLE "quote"`);
        await queryRunner.query(`ALTER TABLE "temporary_quote" RENAME TO "quote"`);
        await queryRunner.query(`CREATE TABLE "temporary_contribute_quote" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "lastModifiedAt" datetime NOT NULL DEFAULT (datetime('now')), "lecturerId" integer, CONSTRAINT "FK_b0694c7cdd656229de4b288a64c" FOREIGN KEY ("lecturerId") REFERENCES "lecturer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_contribute_quote"("id", "content", "lastModifiedAt", "lecturerId") SELECT "id", "content", "lastModifiedAt", "lecturerId" FROM "contribute_quote"`);
        await queryRunner.query(`DROP TABLE "contribute_quote"`);
        await queryRunner.query(`ALTER TABLE "temporary_contribute_quote" RENAME TO "contribute_quote"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contribute_quote" RENAME TO "temporary_contribute_quote"`);
        await queryRunner.query(`CREATE TABLE "contribute_quote" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "lastModifiedAt" datetime NOT NULL DEFAULT (datetime('now')), "lecturerId" integer)`);
        await queryRunner.query(`INSERT INTO "contribute_quote"("id", "content", "lastModifiedAt", "lecturerId") SELECT "id", "content", "lastModifiedAt", "lecturerId" FROM "temporary_contribute_quote"`);
        await queryRunner.query(`DROP TABLE "temporary_contribute_quote"`);
        await queryRunner.query(`ALTER TABLE "quote" RENAME TO "temporary_quote"`);
        await queryRunner.query(`CREATE TABLE "quote" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "lastModifiedAt" datetime NOT NULL DEFAULT (datetime('now')), "lecturerId" integer)`);
        await queryRunner.query(`INSERT INTO "quote"("id", "content", "lastModifiedAt", "lecturerId") SELECT "id", "content", "lastModifiedAt", "lecturerId" FROM "temporary_quote"`);
        await queryRunner.query(`DROP TABLE "temporary_quote"`);
        await queryRunner.query(`DROP TABLE "contribute_lecturer"`);
        await queryRunner.query(`DROP TABLE "contribute_quote"`);
        await queryRunner.query(`DROP TABLE "quote"`);
        await queryRunner.query(`DROP TABLE "lecturer"`);
    }

}
