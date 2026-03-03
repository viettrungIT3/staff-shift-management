# Project Rules - Staff Shift Management

## Git Workflow

### Branch Naming
- `chore/<scope>-<short-name>`: infrastructure, tooling
- `feat/<scope>-<short-name>`: new features
- `fix/<scope>-<short-name>`: bug fixes

### Commit Message Convention
```
<type>(<scope>): <description>

Types: chore, feat, fix, refactor, docs, test
Scope: api, worker, db, docker, repo
```

### Pre-PR Checklist
- [ ] Verify branch: `git branch --show-current`
- [ ] Check changes: `git diff --name-only develop...HEAD`
- [ ] Build test: `docker compose up -d --build`
- [ ] Service check: `docker compose ps` (all Up)
- [ ] Smoke test: `curl http://localhost:8080/health`
- [ ] No sensitive files: `.env`, runtime data not tracked
- [ ] PR description: use `gh pr create --body-file <file.md>`

### Common Mistakes Prevention

#### ❌ Never do this
```bash
# Wrong: commit to wrong branch
git commit -m "fix"   # while on develop

# Wrong: forget ich branch you're on
git stash -u          # lose track of staged files
```

#### ✅ Always do this
```bash
# Before any major operation
git branch --show-current && git status -s

# Before stash with untracked files
git stash push -u -m "wip: <description>"
git stash show -p stash@{0}  # verify content

# When using gh CLI with markdown
gh pr create --base develop --head <branch> --title "<title>" --body-file <file.md>
```

---

## Docker & Runtime

### Container Service Requirement
**Every service must keep running**. Do not exit immediately after startup.

✅ Good:
```javascript
// worker/ocr.worker.js
setInterval(() => {
  console.log('OCR worker heartbeat');
}, 30000);
```

❌ Bad:
```javascript
// worker/ocr.worker.js
console.log('OCR worker started');
// process exits immediately → restart loop
```

### Graceful Shutdown (Required)
All services must handle shutdown signals:

```javascript
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
```

---

ase

### Migration Rules
- One migration = one logical change set
- Always provide `up()` and `down()` functions
- Use knex schema builder (not raw SQL for DDL)
- Foreign keys and indexes must be explicit

---

## Code Style

### ESLint/Prettier (Future)
- TBD when team grows

### Environment Variables
- All configs via `.env` (never hardcode)
- Template in `src/.env.example`
- Never commit `.env` file

---

## Code Review

### Review Process
1. Creator pushes branch: `git push -u origin <branch>`
2. Open PR with description
3. At least 1 approval required
4. CI checks must pass
5. Owner merges after approval

### PR Description Template
```markdown
## Summary
- <change 1>
- <change 2>

## Validation
- [ ] <test 1>
- [ ] <test 2>

## Scope
<modules affected>

## Risk
<potential issues / rollback plan>
```

---

## Common Commands

```bash
# Install dependencies
make install

# Build and start
make up

# View logs
make logs

# Run migrations
make migrate

# Run seeds
make seed

# Stop everything
make down
```
