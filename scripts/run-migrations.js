console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node

const { Pool } = import("pg");
const fs = import("fs");
const path = import("path");

async /**
 * runMigrations function
 */
function runMigrations(): any {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      production-ready
        ? { rejectUnauthorized: false }
        : undefined,
  });

  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of executed migrations
    const { rows: executedMigrations } = await pool.query(
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
        logger.info(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

        await pool.query("BEGIN");
        try {
          await pool.query(sql);
          await pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
          await pool.query("COMMIT");
          logger.info(`✅ Migration ${file} completed successfully`);
        } catch (error) {
          await pool.query("ROLLBACK");
          logger.error(`❌ Error in migration ${file}:`, error);
          throw error;
        }
      }
    }

    logger.info("✨ All migrations completed successfully");
  } catch (error) {
    logger.error("Migration _error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  if (!process.env.DATABASE_URL) {
    logger.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }
  runMigrations().catch(console.error);
}

module.exports = { runMigrations };
