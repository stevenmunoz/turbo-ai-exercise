<div align="center">

```
$ initializing template...
  [ok] Firebase Cloud Functions (Python 3.11)
  [ok] React 18 + TypeScript + Vite
  [ok] Clean Architecture layers wired
  [ok] Firestore connected
  [ok] Firebase Auth ready
  [ok] Claude Code tooling loaded

  All systems go. Ready to build.
```

# Starter Template

**For the builders shipping nights & weekends.**

A serverless full-stack starter — opinionated so you don't have to be.

[Get Started](#get-running) · [Architecture](#architecture) · [Docs](docs/)

</div>

---

## What's in the box

| Layer | Tech | Why |
|-------|------|-----|
| **Backend** | Firebase Cloud Functions (Python 3.11) | Serverless, scales to zero, $0-5/month |
| **Frontend** | React 18 + TypeScript + Vite | Fast dev server, strict types, HMR |
| **Database** | Cloud Firestore | NoSQL, real-time sync, auto-scaling |
| **Auth** | Firebase Authentication | Email/password, OAuth, JWT tokens |
| **Architecture** | Clean Architecture | Domain → Application → Infrastructure |
| **DI** | Simple Python container | No external library, lazy properties |
| **AI Tooling** | Claude Code (.claude/) | Skills, commands, agents — ready to go |
| **Orchestration** | Conductor | Setup, run, and archive via `conductor.json` |

## Get running

```bash
./setup.sh    # installs deps, creates venvs, generates .env
./dev.sh      # starts Firebase emulators + web dev server
```

That's it. Three services come up:

```
Web App          → http://localhost:3000
Emulator UI      → http://localhost:4000
Cloud Functions  → http://localhost:5001
Firestore        → http://localhost:8080
```

Test it:

```bash
curl http://localhost:5001/demo-project/us-central1/health
curl "http://localhost:5001/demo-project/us-central1/helloWorld?name=World"
```

> **Using Conductor?** It runs `scripts/conductor-setup.sh` and `scripts/conductor-run.sh` automatically via `conductor.json`.

## Architecture

```
Cloud Functions → Handlers → Use Cases → Domain ← Firestore Repositories
```

Dependencies point inward. Domain has zero external imports.

```
backend/
├── functions/                # Serverless entry points
│   ├── main.py              # Register functions here
│   └── handlers/            # HTTP handlers + container init
│
└── src/                      # Clean Architecture
    ├── core/                # Config, exceptions, logging, security
    ├── domain/              # Entities, repo interfaces, services
    ├── application/         # Use cases, DTOs (Pydantic)
    └── infrastructure/      # Firestore repos, DI container
```

### Simple DI — no library

```python
class Container:
    @property
    def user_repository(self) -> UserRepository:
        if self._user_repository is None:
            self._user_repository = UserRepository(db=self.db)
        return self._user_repository

    def create_user_use_case(self) -> CreateUserUseCase:
        return CreateUserUseCase(user_repository=self.user_repository)
```

Global container reused across invocations for cold start performance:

```python
_container = None

def get_container() -> Container:
    global _container
    if _container is None:
        _container = Container()
    return _container
```

## Add your first function

**1. Handler** — `backend/functions/handlers/http_handlers.py`

```python
def my_function(request: Request) -> Tuple[Dict[str, Any], int]:
    data = request.get_json()
    container = get_container()
    use_case = container.my_use_case()
    result = use_case.execute(data)
    return json_response(result.to_dict(), 200)
```

**2. Register** — `backend/functions/main.py`

```python
@functions_framework.http
def myFunction(request: Request):
    return http_handlers.my_function(request)
```

**3. Test**

```bash
curl -X POST http://localhost:5001/demo-project/us-central1/myFunction \
  -H "Content-Type: application/json" \
  -d '{"name": "World"}'
```

## Claude Code tooling

The `.claude/` directory ships with reusable agent tooling:

```
.claude/
├── commands/       # /create-branch, /create-pr, /dev-start, /watch-ci,
│                   # /resolve-merge-conflicts, /cleanup-merged-branches, /fix-pr-comments
├── skills/         # pre-flight, deploy-function, debug-cloud-function,
│                   # test-suite, feature-completion-check, skill-creator
└── agents/         # backend-debugger, code-quality-guardian, test-coverage-specialist
```

## Deploy

```bash
./deploy.sh
```

Functions go live at `https://us-central1-<project-id>.cloudfunctions.net/<functionName>`
Web app at `https://<project-id>.web.app`

## Docs

- [Getting Started](docs/setup/getting-started.md)
- [Serverless Architecture](docs/architecture/serverless.md)
- [Clean Architecture](docs/architecture/CLEAN_ARCHITECTURE.md)
- [Deployment](docs/deployment/DEPLOYMENT.md)
- [Troubleshooting](docs/setup/troubleshooting.md)

---

<div align="center">

Built by [stevenmunoz](https://github.com/stevenmunoz) · For the builders shipping nights & weekends

</div>
