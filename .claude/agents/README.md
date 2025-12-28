# 1MarketPulse Agent System

## Wave-Based Parallel Execution System (v3.0)

**Version**: 3.0.0
**Date**: 2025-12-29
**Hardware Optimized**: Mac Mini M4 Pro (12 cores, 24GB RAM)
**Focus**: Maximum Parallelization for Development Speed

---

## How It Works: Wave-Based Execution

Instead of running agents sequentially, we run them in **parallel waves**:

```
WAVE 1 (Research)    -> 4 agents run SIMULTANEOUSLY
       |
WAVE 2 (Planning)    -> 1 agent synthesizes findings
       |
WAVE 3 (Implement)   -> Up to 5 agents run SIMULTANEOUSLY
       |
WAVE 4 (Quality)     -> 2 agents run SIMULTANEOUSLY
```

**Result**: 50% faster development vs. sequential execution

### Available Agents (subagent_types)

| Role | subagent_type | Use For |
|------|---------------|---------|
| **SCOUT** | `Explore` | Find files, understand code, search codebase |
| **TECH** | `research` | Performance, architecture, modern tech |
| **MARKET** | `research` | Financial data, trading, APIs |
| **DESIGNER** | `interface` | UI/UX, components, accessibility |
| **ARCHITECT** | `plan-feature` | Implementation plans, task breakdown |
| **BUILDER** | `general-purpose` | Code implementation |
| **REVIEWER** | `code-review` | Code quality, security audit |
| **DOCUMENTER** | `write-docs` | README, API docs, app-truth.md |

---

## Usage Examples

### Complex Task: "Add portfolio analytics dashboard"

```
WAVE 1 - RESEARCH (All 4 in parallel):
├─ [Explore] Find existing portfolio/dashboard code
├─ [research] Research visualization libraries
├─ [research] Research portfolio metrics (Sharpe, alpha, beta)
└─ [interface] Design dashboard UI
    ↓ (wait for all)

WAVE 2 - PLANNING:
└─ [plan-feature] Create implementation plan from findings
    ↓

WAVE 3 - IMPLEMENT (Parallel by module):
├─ [general-purpose] Types & interfaces
├─ [general-purpose] Portfolio service
├─ [general-purpose] usePortfolioAnalytics hook
└─ [general-purpose] Dashboard components
    ↓

WAVE 4 - QUALITY (Parallel):
├─ [code-review] Review implementation
└─ [write-docs] Update documentation

Result: ~50 min vs ~100 min sequential = 50% faster!
```

### Simple Tasks (Direct Agents)

```
"Document the API" → [write-docs]
"Optimize performance" → [research] + [general-purpose]
"Design a news feed" → [interface]
"Fix this bug" → [Explore] → [general-purpose]
"Review my code" → [code-review]
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
