# 1MarketPulse Agent System

## Multi-Agent Orchestration System (v2.1)

**Version**: 2.1.0
**Date**: 2025-12-27
**Hardware Optimized**: Mac Mini M4 Pro (12 cores, 24GB RAM)

---

## How It Works

### The ORCHESTRATOR is Your Entry Point

For any complex task, use `@agent-orchestrator`. It will:

1. **Analyze** your request
2. **Decompose** into subtasks
3. **Delegate** to specialist agents (in parallel when possible)
4. **Synthesize** results into a unified deliverable

### Available Agents

| Agent | What It Does | How to Invoke Directly |
|-------|--------------|------------------------|
| **ORCHESTRATOR** | Coordinates multi-agent tasks | `@agent-orchestrator [task]` |
| **TECHSTACK** | Performance, architecture, modern tech | `@agent-techstack` or `research` tasks |
| **CREATIVE** | UX/UI design, engagement, metaphors | `@agent-creative` or `interface` tasks |
| **MARKETS** | Financial analysis, trading, data science | `@agent-markets` or market `research` |
| **PLANNER** | Implementation plans, task breakdown | `@agent-planner` or `plan-feature` |
| **DOCUMENTER** | Documentation, README, API docs | `@agent-documenter` or `write-docs` |
| **EXPLORER** | Codebase exploration, file search | `Explore` tasks |
| **REVIEWER** | Code review, security audit | `code-review` tasks |

---

## Usage Examples

### Complex Task (Orchestrated)

```
User: "@agent-orchestrator Add a portfolio analytics dashboard with AI predictions"

ORCHESTRATOR automatically:
├─ PHASE 1 (Parallel):
│  ├─ CREATIVE: Design dashboard UI
│  ├─ MARKETS: Research analytics metrics (Sharpe, alpha, beta)
│  └─ TECHSTACK: Research AI/ML libraries
│
├─ PHASE 2 (Sequential - needs Phase 1 results):
│  └─ PLANNER: Create implementation plan
│
└─ PHASE 3 (After implementation):
   └─ DOCUMENTER: Update docs

Result: 32-52% faster than sequential execution!
```

### Simple Task (Direct Agent)

```
User: "Document the API endpoints"
→ Direct to DOCUMENTER (no orchestration overhead)

User: "Optimize server performance"
→ Direct to TECHSTACK

User: "Design a creative news feed"
→ Direct to CREATIVE
```

---

## Task Distribution Rules

### ORCHESTRATOR Delegates Based On:

| Task Type | Primary Agent | Secondary | Execution Mode |
|-----------|---------------|-----------|----------------|
| New Feature | PLANNER | CREATIVE, MARKETS | Sequential |
| Performance | TECHSTACK | PLANNER | Parallel → Plan |
| UI Redesign | CREATIVE | PLANNER | Sequential |
| Market Analysis | MARKETS | DOCUMENTER | Parallel |
| Bug Fix | PLANNER | REVIEWER | Sequential |
| Documentation | DOCUMENTER | - | Single |
| Code Search | EXPLORER | - | Single |
| Full Feature | ALL AGENTS | - | Phased |

### Parallel vs Sequential

**Run in Parallel** (independent tasks):
- Research tasks (TECHSTACK + MARKETS + CREATIVE all researching)
- Read-only analysis
- Non-overlapping file changes

**Run Sequential** (dependencies):
- Design → Implementation (need design first)
- Research → Planning (need findings)
- Implementation → Documentation (need code)
- Code → Review (need code to review)

---

## Agent Specializations

### TECHSTACK (Performance Expert)
- Bundle optimization, server performance
- M4 Pro multi-core utilization
- Modern frameworks (React 19, Bun, Hono)
- Caching strategies (Redis, IndexedDB)

### CREATIVE (UX Innovator)
- Unconventional interface design
- Metaphor-driven UI (heartbeat, weather, DNA)
- Gamification and engagement
- Accessibility with creativity

### MARKETS (Financial Expert)
- Technical/fundamental analysis
- Trading strategies and risk metrics
- Python libraries for finance
- Market data integration

### PLANNER (Implementation Strategist)
- Task decomposition
- File-by-file implementation plans
- Dependency management
- Risk assessment

### DOCUMENTER (Knowledge Manager)
- README, API documentation
- Code comments (JSDoc)
- app-truth.md maintenance
- Migration guides

---

## Output Locations

```
Pulse2/
├── docs/
│   ├── orchestration/     # ORCHESTRATOR reports
│   ├── research/          # TECHSTACK reports
│   ├── design/            # CREATIVE specs
│   ├── market-analysis/   # MARKETS reports
│   ├── features/          # PLANNER plans
│   └── API.md             # DOCUMENTER
├── app-truth.md           # Technical truth
└── README.md              # Project docs
```

---

## Quick Reference

| You Say... | Agent Activated |
|------------|-----------------|
| "optimize", "performance", "architecture" | TECHSTACK |
| "design", "UI", "UX", "creative" | CREATIVE |
| "market", "trading", "financial", "predict" | MARKETS |
| "plan", "implement", "strategy" | PLANNER |
| "document", "README", "API docs" | DOCUMENTER |
| "find", "search", "where is" | EXPLORER |
| "review", "check code", "audit" | REVIEWER |
| Complex multi-domain task | ORCHESTRATOR |

---

## Best Practices

### DO:
- Use `@agent-orchestrator` for complex tasks
- Be specific about what you want
- Let agents work in parallel when possible
- Review agent outputs before implementation

### DON'T:
- Micromanage agent selection for simple tasks
- Break complex tasks manually (let ORCHESTRATOR decompose)
- Skip the documentation phase
- Ignore risk assessments in plans

---

**System Version**: 2.1.0
**Updated**: 2025-12-27
**Status**: Production Ready
