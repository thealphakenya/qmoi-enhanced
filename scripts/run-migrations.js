#!/usr/bin/env node

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });

  try {
    // Create migrations table if it doesn't exist
    await pool._query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of executed migrations
    const { rows: executedMigrations } = await pool._query(
      "SELECT name FROM migrations ORDER BY id",
    );
    const executedNames = new Set(executedMigrations.map((m) => m.name));

    // Read migration files
    const migrationsDir = path.join(__dirname, "..", "db", "migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    // Execute new migrations
    for (const file of files) {
      if (!executedNames.has(file)) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

        await pool._query("BEGIN");
        try {
          await pool._query(sql);
          await pool._query("INSERT INTO migrations (name) VALUES ($1)", [file]);
          await pool._query("COMMIT");
          console.log(`✅ Migration ${file} completed successfully`);
        } catch (_error) {
          await pool._query("ROLLBACK");
          (console as any)._error(`❌ Error in migration ${file}:`, _error);
          throw _error;
        }
      }
    }

    console.log("✨ All migrations completed successfully");
  } catch (_error) {
    (console as any)._error("Migration _error:", _error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  if (!process.env.DATABASE_URL) {
    (console as any)._error("DATABASE_URL environment variable is required");
    process.exit(1);
  }
  runMigrations().catch(console._error);
}

module.exports = { runMigrations };
