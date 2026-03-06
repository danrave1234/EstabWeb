#!/usr/bin/env node
/**
 * Migration CLI
 *
 * Usage:
 *   node scripts/migrate.js migrate        — run all pending migrations
 *   node scripts/migrate.js status         — show applied / pending migrations
 *   node scripts/migrate.js create <name>  — create a new numbered migration file
 *
 * Requires DATABASE_URL in .env.local (or environment):
 *   DATABASE_URL=postgresql://user:pass@host:port/db
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set. Add it to .env.local:\n   DATABASE_URL=postgresql://user:pass@host:port/db');
  process.exit(1);
}

const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations');

// ── DB helpers ───────────────────────────────────────────────────────────────
async function getClient() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  return client;
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         serial PRIMARY KEY,
      name       text UNIQUE NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function getApplied(client) {
  const { rows } = await client.query('SELECT name FROM _migrations ORDER BY id');
  return new Set(rows.map(r => r.name));
}

// ── Get sorted migration files ───────────────────────────────────────────────
function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error(`❌  migrations/ directory not found at: ${MIGRATIONS_DIR}`);
    process.exit(1);
  }
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
}

// ── Commands ─────────────────────────────────────────────────────────────────
async function cmdMigrate() {
  const client = await getClient();
  try {
    await ensureMigrationsTable(client);
    const applied = await getApplied(client);
    const files = getMigrationFiles();
    const pending = files.filter(f => !applied.has(f));

    if (pending.length === 0) {
      console.log('✅  All migrations are already applied. Nothing to run.');
      return;
    }

    console.log(`🚀  Running ${pending.length} pending migration(s)...\n`);

    for (const file of pending) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      process.stdout.write(`  ▶  ${file} ... `);
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log('✅  done');
      } catch (err) {
        await client.query('ROLLBACK');
        console.log('❌  FAILED');
        console.error(`\n     Error: ${err.message}\n`);
        console.error('     Migration halted. Fix the error and re-run.');
        process.exit(1);
      }
    }

    console.log('\n✅  All migrations applied successfully.');
  } finally {
    await client.end();
  }
}

async function cmdStatus() {
  const client = await getClient();
  try {
    await ensureMigrationsTable(client);
    const applied = await getApplied(client);
    const files = getMigrationFiles();

    console.log('\nMigration Status\n' + '─'.repeat(50));
    if (files.length === 0) {
      console.log('  (no migration files found in migrations/)');
    }
    for (const file of files) {
      const status = applied.has(file) ? '✅  applied ' : '⏳  pending ';
      console.log(`  ${status}  ${file}`);
    }

    // Show applied migrations not in files (e.g. deleted)
    for (const name of applied) {
      if (!files.includes(name)) {
        console.log(`  ⚠️   missing file  ${name}`);
      }
    }

    const pendingCount = files.filter(f => !applied.has(f)).length;
    console.log('─'.repeat(50));
    console.log(`  ${files.length - pendingCount} applied, ${pendingCount} pending\n`);
  } finally {
    await client.end();
  }
}

function cmdCreate(name) {
  if (!name) {
    console.error('❌  Please provide a migration name: node scripts/migrate.js create <name>');
    process.exit(1);
  }

  const files = getMigrationFiles();
  // Find highest number
  let maxNum = 0;
  for (const f of files) {
    const match = f.match(/^(\d+)/);
    if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10));
  }
  const nextNum = String(maxNum + 1).padStart(3, '0');
  const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const filename = `${nextNum}_${safeName}.sql`;
  const filePath = path.join(MIGRATIONS_DIR, filename);

  const template = `-- Migration: ${filename}\n-- Created: ${new Date().toISOString()}\n\n-- Write your SQL here\n`;
  fs.writeFileSync(filePath, template, 'utf8');
  console.log(`✅  Created migration: migrations/${filename}`);
}

// ── Entry point ───────────────────────────────────────────────────────────────
const [,, command, ...args] = process.argv;

switch (command) {
  case 'migrate':
    cmdMigrate().catch(err => { console.error(err.message); process.exit(1); });
    break;
  case 'status':
    cmdStatus().catch(err => { console.error(err.message); process.exit(1); });
    break;
  case 'create':
    cmdCreate(args[0]);
    break;
  default:
    console.log(`
Migration CLI — Usage:

  node scripts/migrate.js migrate          Run all pending migrations
  node scripts/migrate.js status           Show migration status
  node scripts/migrate.js create <name>    Create a new migration file

Setup:
  Add DATABASE_URL to your .env.local file:
  DATABASE_URL=postgresql://user:pass@host:port/db
`);
}
