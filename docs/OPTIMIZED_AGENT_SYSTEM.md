# Optimized Agent System for 1MarketPulse

**Version**: 3.0.0
**Date**: 2025-12-29
**Status**: Ready for Implementation
**Focus**: Maximum Parallelization & Development Speed

---

## Executive Summary

After analyzing the current agent system, I've identified several opportunities for optimization:

### Current Issues

| Issue | Impact | Solution |
|-------|--------|----------|
| **Mapping Mismatch** | Confusion between conceptual agents and actual `subagent_type` | Direct mapping to available types |
| **Sequential Bottlenecks** | Tasks wait unnecessarily | Parallel execution pipelines |
| **Orchestrator Overhead** | Single coordinator slows everything | Distributed orchestration |
| **Underutilized Parallelism** | M4 Pro 12 cores at 25% usage | True parallel agent spawning |
| **Phase Dependencies** | Linear waterfall approach | Wave-based parallel phases |

### Proposed Solution

**WAVE-BASED PARALLEL EXECUTION MODEL** - Execute agents in waves where each wave runs maximum parallel agents.

```
WAVE 1 (Research & Exploration) ─────────────────────────────────
├─ Explore (codebase search)     ]
├─ research (tech research)       ] ALL PARALLEL - 0 dependencies
├─ research (market research)     ]
└─ interface (design research)   ]
      ↓ (wait for all)
WAVE 2 (Planning) ────────────────────────────────────────────────
└─ plan-feature (consolidated plan)
      ↓
WAVE 3 (Implementation) ─────────────────────────────────────────
├─ general-purpose (implement A) ]
├─ general-purpose (implement B) ] PARALLEL if no file conflicts
└─ general-purpose (implement C) ]
      ↓
WAVE 4 (Quality) ────────────────────────────────────────────────
├─ code-review                   ] PARALLEL - read-only
└─ write-docs                    ]
```

**Result**: 50-70% faster development vs. sequential execution

---

## Available Subagent Types (Real Tool Mapping)

| subagent_type | Purpose | Tools Access | Parallel? |
|---------------|---------|--------------|-----------|
| `Explore` | Fast codebase exploration, file finding | Read, Glob, Grep, Bash | Yes |
| `research` | Solutions, libraries, best practices | Read, Glob, Grep, WebSearch | Yes |
| `interface` | UI components, design systems | Read, Glob, Grep, Edit, Write | Yes* |
| `plan-feature` | Detailed technical plans | Read, Glob, Grep, Bash, WebSearch | Sequential |
| `general-purpose` | Complex multi-step implementation | All tools | Conditional |
| `code-review` | Code review, security audit | All tools | Yes (read-only) |
| `write-docs` | Documentation | All tools | Yes* |
| `orchestrator` | Full development workflow | All tools | Entry point |
| `Plan` | Software architecture | All tools | Yes |

*\*Parallel if targeting different files*

---

## Optimized Agent Roles

### Role 1: SCOUT (subagent_type: `Explore`)

**Mission**: Rapid codebase exploration and pattern discovery

**Use Cases**:
- Find all files related to a feature
- Understand existing patterns
- Map dependencies
- Answer "where is X?" questions

**Prompt Template**:
```
Explore 1MarketPulse codebase thoroughly. Find:
- [specific files/patterns]
- Related components and services
- Existing patterns to follow
- Potential conflicts

Search directories: src/, server/, docs/
Be thorough - check multiple locations.
Return: File list with descriptions and key code snippets.
```

**Parallelization**: Always run in parallel with other research agents.

---

### Role 2: TECH-RESEARCHER (subagent_type: `research`)

**Mission**: Technology research, performance optimization, architecture

**Use Cases**:
- Research latest libraries (2025)
- Optimize performance
- Architecture decisions
- Best practices

**Prompt Template**:
```
Research [TOPIC] for 1MarketPulse.

Current stack: React 18, Vite, TypeScript, Tailwind, Hono, Bun
Hardware: Mac Mini M4 Pro (12 cores, 24GB RAM)

Research:
1. Latest 2025 solutions
2. Performance benchmarks
3. Implementation approach
4. Trade-offs

Output: Recommendations with code examples.
```

**Parallelization**: Always parallel with other research and exploration.

---

### Role 3: MARKET-RESEARCHER (subagent_type: `research`)

**Mission**: Financial markets expertise, trading logic, data science

**Use Cases**:
- Market analysis features
- Financial calculations
- API integrations (Finnhub, CoinGecko)
- Trading algorithms

**Prompt Template**:
```
Research [FINANCIAL TOPIC] for 1MarketPulse.

APIs: Finnhub, CoinGecko, Fear & Greed, Ollama AI
Data: Stocks, crypto, sentiment, news

Analyze:
1. Market analysis approach
2. Data requirements
3. Python/TypeScript libraries
4. Implementation strategy

Output: Analysis with code examples.
```

**Parallelization**: Always parallel with other research.

---

### Role 4: DESIGNER (subagent_type: `interface`)

**Mission**: Unconventional UI/UX design, engagement optimization

**Use Cases**:
- Component design
- Design system updates
- Accessibility
- Gamification

**Prompt Template**:
```
Design [FEATURE] for 1MarketPulse.

Design system: Tailwind, shadcn/ui, glassmorphism, dark mode
Philosophy: ATYPICAL, UNCONVENTIONAL, MEMORABLE
Constraints: WCAG AA, responsive, 60fps animations

Create:
1. Visual specifications
2. Component structure
3. Interaction patterns
4. Accessibility plan

Be creative - use metaphors (heartbeat, weather, DNA).
```

**Parallelization**: Parallel with research, sequential before implementation.

---

### Role 5: ARCHITECT (subagent_type: `plan-feature`)

**Mission**: Detailed implementation plans with file-level specifications

**Use Cases**:
- Feature planning
- Implementation roadmaps
- Risk assessment
- Dependency mapping

**Prompt Template**:
```
Create implementation plan for: [FEATURE]

Context from research:
- SCOUT found: [summary]
- TECH-RESEARCHER recommends: [summary]
- MARKET-RESEARCHER analyzed: [summary]
- DESIGNER created: [summary]

Create plan with:
1. Step-by-step implementation
2. Files to create/modify
3. Code structure (interfaces, functions)
4. Dependencies and risks
5. Testing strategy

Output: Detailed plan ready for implementation.
```

**Parallelization**: Sequential - requires research results first.

---

### Role 6: BUILDER (subagent_type: `general-purpose`)

**Mission**: Implement features according to plan

**Use Cases**:
- Code implementation
- Bug fixes
- Refactoring
- Integration

**Prompt Template**:
```
Implement [FEATURE] for 1MarketPulse.

Follow this plan:
[paste plan from ARCHITECT]

Requirements:
- TypeScript strict mode
- Follow existing patterns (check app-truth.md)
- Add proper error handling
- Include loading/error states

Output: Working implementation with all files.
```

**Parallelization**:
- Parallel if implementing independent modules
- Sequential if files overlap

---

### Role 7: REVIEWER (subagent_type: `code-review`)

**Mission**: Code quality, security, performance review

**Use Cases**:
- Code review
- Security audit
- Performance check
- Best practices validation

**Prompt Template**:
```
Review [FEATURE/FILES] in 1MarketPulse.

Check for:
1. Code quality (TypeScript, patterns)
2. Security (XSS, injection, secrets)
3. Performance (re-renders, memory leaks)
4. Accessibility (WCAG AA)
5. Error handling

Output: Issues found with severity and fixes.
```

**Parallelization**: Always parallel with documentation.

---

### Role 8: DOCUMENTER (subagent_type: `write-docs`)

**Mission**: Documentation maintenance

**Use Cases**:
- Update README, app-truth.md
- API documentation
- Code comments
- User guides

**Prompt Template**:
```
Document [FEATURE] in 1MarketPulse.

Update:
- app-truth.md (technical source of truth)
- docs/API.md (if new endpoints)
- README.md (if user-facing)
- Inline comments (JSDoc)

Style: Clear, concise, with examples.
```

**Parallelization**: Always parallel with review.

---

## Parallel Execution Pipelines

### Pipeline 1: New Feature Development

```
┌─────────────────────────────────────────────────────────────────┐
│                     WAVE 1: RESEARCH (Parallel)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  SCOUT   │  │   TECH   │  │  MARKET  │  │ DESIGNER │        │
│  │ (Explore)│  │(research)│  │(research)│  │(interface)│        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       └──────────────┴──────────────┴──────────────┘            │
│                           ↓ (all complete)                      │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                   WAVE 2: PLANNING (Sequential)                  │
│                    ┌────────────────┐                           │
│                    │   ARCHITECT    │                           │
│                    │ (plan-feature) │                           │
│                    └───────┬────────┘                           │
│                            ↓                                    │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                WAVE 3: IMPLEMENTATION (Parallel*)                │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│         │ BUILDER  │  │ BUILDER  │  │ BUILDER  │               │
│         │(module A)│  │(module B)│  │(module C)│               │
│         └────┬─────┘  └────┬─────┘  └────┬─────┘               │
│              └──────────────┴──────────────┘                    │
│                            ↓                                    │
│  * Parallel only if modules don't share files                   │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                   WAVE 4: QUALITY (Parallel)                    │
│              ┌──────────┐      ┌──────────┐                    │
│              │ REVIEWER │      │DOCUMENTER│                    │
│              │(code-rev)│      │(write-doc)│                    │
│              └──────────┘      └──────────┘                    │
└─────────────────────────────────────────────────────────────────┘

TOTAL TIME: ~45% of sequential execution
```

### Pipeline 2: Bug Fix / Quick Change

```
┌─────────────────────────────────────────────────────────────────┐
│                     WAVE 1: INVESTIGATE                          │
│                    ┌──────────┐                                 │
│                    │  SCOUT   │                                 │
│                    │(Explore) │                                 │
│                    └────┬─────┘                                 │
│                         ↓                                       │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                     WAVE 2: FIX                                 │
│                    ┌──────────┐                                 │
│                    │ BUILDER  │                                 │
│                    │(general) │                                 │
│                    └────┬─────┘                                 │
│                         ↓                                       │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                   WAVE 3: VALIDATE (Parallel)                   │
│              ┌──────────┐      ┌──────────┐                    │
│              │ REVIEWER │      │DOCUMENTER│                    │
│              │(if major)│      │(if needed)│                    │
│              └──────────┘      └──────────┘                    │
└─────────────────────────────────────────────────────────────────┘

TOTAL TIME: Minimal - straight to fix
```

### Pipeline 3: Performance Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│                   WAVE 1: ANALYSIS (Parallel)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  SCOUT   │  │   TECH   │  │ DESIGNER │                      │
│  │(find slow│  │(research │  │ (UI perf │                      │
│  │  code)   │  │ options) │  │ issues)  │                      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                      │
│       └──────────────┴──────────────┘                          │
│                       ↓                                         │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                   WAVE 2: PLAN & IMPLEMENT                      │
│         ┌────────────────┐                                      │
│         │   ARCHITECT    │                                      │
│         │(opt. plan)     │                                      │
│         └───────┬────────┘                                      │
│                 ↓                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ BUILDER  │  │ BUILDER  │  │ BUILDER  │  ← Parallel          │
│  │(bundle)  │  │(backend) │  │(UI)      │    optimizations     │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

### Pipeline 4: Full Feature Redesign

```
WAVE 1: RESEARCH (All 4 agents parallel)
   ↓
WAVE 2: DESIGN CONSOLIDATION
   - DESIGNER creates unified design from research
   ↓
WAVE 3: PLAN
   - ARCHITECT creates implementation plan
   ↓
WAVE 4: IMPLEMENT (Up to 5 BUILDERS parallel by module)
   - Types & interfaces
   - Services
   - Hooks
   - Components
   - Integration
   ↓
WAVE 5: QUALITY (Parallel)
   - REVIEWER + DOCUMENTER

PARALLELIZATION GAIN: ~60%
```

---

## Execution Rules

### Rule 1: Maximize Wave Parallelism

```
GOOD:
<Task subagent_type="Explore">Find auth patterns...</Task>
<Task subagent_type="research">Research JWT best practices...</Task>
<Task subagent_type="interface">Design login UI...</Task>
[All in same message = parallel execution]

BAD:
<Task subagent_type="Explore">Find auth patterns...</Task>
[wait]
<Task subagent_type="research">Research JWT...</Task>
[wait]
<Task subagent_type="interface">Design login UI...</Task>
[Sequential = 3x slower]
```

### Rule 2: No File Conflicts in Parallel

```
SAFE PARALLEL:
- BUILDER A: src/services/newService.ts (new file)
- BUILDER B: src/hooks/useNewFeature.ts (new file)
- BUILDER C: src/types/newTypes.ts (new file)

MUST BE SEQUENTIAL:
- BUILDER A: src/app/App.tsx (modifying)
- BUILDER B: src/app/App.tsx (modifying)
→ Run BUILDER A first, then BUILDER B
```

### Rule 3: Research Before Planning

Always run research agents (SCOUT, TECH, MARKET, DESIGNER) BEFORE ARCHITECT.
ARCHITECT synthesizes their findings into a coherent plan.

### Rule 4: Review and Docs in Parallel

REVIEWER and DOCUMENTER are read-heavy operations.
Always run them in parallel at the end.

---

## Quick Reference: Task Templates

### WAVE 1 - Research Template (Copy all 4)

```xml
<!-- All 4 in same message for parallel execution -->

<Task subagent_type="Explore">
Find all code related to [FEATURE] in 1MarketPulse.
Search: src/, server/
Return: File list with descriptions.
</Task>

<Task subagent_type="research">
Research technology best practices for [FEATURE].
Stack: React 18, Vite, TypeScript, Hono, Bun
Output: Recommendations with code examples.
</Task>

<Task subagent_type="research">
Research financial/market aspects of [FEATURE].
APIs: Finnhub, CoinGecko, Fear & Greed
Output: Analysis with implementation approach.
</Task>

<Task subagent_type="interface">
Design unconventional UI for [FEATURE].
Style: Dark mode, glassmorphism, shadcn/ui
Output: Visual specs and component structure.
</Task>
```

### WAVE 2 - Planning Template

```xml
<Task subagent_type="plan-feature">
Create detailed implementation plan for [FEATURE].

Research findings:
- SCOUT: [paste findings]
- TECH: [paste findings]
- MARKET: [paste findings]
- DESIGNER: [paste findings]

Create step-by-step plan with:
1. File changes (create/modify)
2. Code structure
3. Dependencies
4. Risks & mitigations
</Task>
```

### WAVE 3 - Implementation Template

```xml
<!-- Parallel if different files -->
<Task subagent_type="general-purpose">
Implement types and interfaces for [FEATURE].
Plan: [paste relevant section]
</Task>

<Task subagent_type="general-purpose">
Implement service layer for [FEATURE].
Plan: [paste relevant section]
</Task>

<Task subagent_type="general-purpose">
Implement React hook for [FEATURE].
Plan: [paste relevant section]
</Task>

<Task subagent_type="general-purpose">
Implement UI components for [FEATURE].
Plan: [paste relevant section]
</Task>
```

### WAVE 4 - Quality Template

```xml
<!-- Parallel - both read-only operations -->
<Task subagent_type="code-review">
Review [FEATURE] implementation.
Files: [list files created]
Check: Security, performance, accessibility, best practices.
</Task>

<Task subagent_type="write-docs">
Document [FEATURE] in 1MarketPulse.
Update: app-truth.md, README if needed.
Add: JSDoc comments, API docs.
</Task>
```

---

## Performance Metrics

### Before (Sequential)

| Task | Time | Utilization |
|------|------|-------------|
| Explore | 5 min | 8% CPU |
| Tech Research | 8 min | 8% CPU |
| Market Research | 8 min | 8% CPU |
| UI Design | 10 min | 8% CPU |
| Planning | 15 min | 8% CPU |
| Implementation | 30 min | 8% CPU |
| Review | 10 min | 8% CPU |
| Docs | 10 min | 8% CPU |
| **TOTAL** | **96 min** | **8% avg** |

### After (Parallel Waves)

| Wave | Tasks | Time | Utilization |
|------|-------|------|-------------|
| Wave 1 | 4 parallel | 10 min | 32% CPU |
| Wave 2 | 1 (synthesize) | 15 min | 8% CPU |
| Wave 3 | 4 parallel | 15 min | 32% CPU |
| Wave 4 | 2 parallel | 10 min | 16% CPU |
| **TOTAL** | | **50 min** | **22% avg** |

**Speed Improvement: 48% faster**
**CPU Utilization: 2.75x better**

---

## Implementation Checklist

### Phase 1: Update Agent Files (30 min)

- [ ] Create new orchestration workflow in `.claude/agents/orchestrator.md`
- [ ] Update agent templates with wave-based prompts
- [ ] Add parallel execution rules

### Phase 2: Update Documentation (15 min)

- [ ] Update `.claude/agents/README.md`
- [ ] Update `docs/AGENT_SYSTEM_REDESIGN.md`
- [ ] Reference this document from app-truth.md

### Phase 3: Training & Testing (1 hour)

- [ ] Test Wave 1 parallel execution (4 agents)
- [ ] Test Wave 3 parallel implementation
- [ ] Measure actual time savings
- [ ] Refine prompts based on results

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Execution Model | Sequential | Wave-based Parallel |
| Agent Utilization | 1 at a time | Up to 5 concurrent |
| CPU Usage | 8% | 22-40% |
| Feature Dev Time | ~100 min | ~50 min |
| M4 Pro Optimization | Minimal | Leveraged |

**Key Changes**:
1. **WAVE-BASED EXECUTION**: Agents run in parallel waves
2. **DIRECT MAPPING**: Roles map directly to `subagent_type`
3. **NO ORCHESTRATOR OVERHEAD**: Parallel spawn, not sequential delegation
4. **CLEAR DEPENDENCIES**: Waves define what waits for what
5. **MAX PARALLELISM**: 4-5 agents running simultaneously

---

**Created**: 2025-12-29
**Author**: Claude Code Analysis
**Status**: Ready for Implementation
**Next Step**: Update orchestrator.md with new workflow
