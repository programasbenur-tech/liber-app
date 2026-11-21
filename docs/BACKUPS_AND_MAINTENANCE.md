# LIBER ❤️ — Backups, Recovery & Maintenance Strategy

## 1. Golden Rule: GitHub ≠ Database Backup
- **GitHub** backs up source code, SQL migrations, and configuration templates—**never** live user data.
- **Supabase Free** does **not** include automatic daily backups. Upgrade to **Supabase Pro** before commercial launch to enable automated daily backups and Point-in-Time Recovery (PITR).

## 2. Manual Backup Procedure (During Free/Dev Stage)
Run periodic logical backups using `pg_dump` (requires PostgreSQL client tools and your Supabase DB connection string):

```bash
pg_dump "$SUPABASE_DB_URL" --format=custom --file="liber_backup_$(date +%Y%m%d).dump"
```

Store encrypted `.dump` files in a private, access-controlled cloud bucket (never in GitHub).

## 3. Recovery Testing
1. Create a staging Supabase project.
2. Apply migrations (`001_initial_saas_schema.sql`, `002_seed_plans_flags.sql`).
3. Restore test dump with `pg_restore` and verify RLS policies and row counts.

## 4. Maintenance & Dependency Updates
- Run `npm audit` and `npm outdated` monthly on a `chore/deps` feature branch.
- Verify `npm test` and `npm run build` in GitHub Actions CI before merging to `main`.
- Track releases using semantic tags (`git tag v1.0.0`).
