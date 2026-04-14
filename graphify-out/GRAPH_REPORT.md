# Graph Report - .  (2026-04-13)

## Corpus Check
- 42 files · ~10,805 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 93 nodes · 115 edges · 13 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `AstroService` - 6 edges
2. `ProfileService` - 5 edges
3. `LoggerService` - 4 edges
4. `BirthChartService` - 4 edges
5. `DoshaService` - 4 edges
6. `DoshaReportHelper` - 3 edges
7. `AstroController` - 2 edges
8. `DoshaController` - 2 edges
9. `ProfileController` - 2 edges
10. `ChartController` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (0): 

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (2): AstroController, UserController

### Community 2 - "Community 2"
Cohesion: 0.2
Nodes (1): LoggerService

### Community 3 - "Community 3"
Cohesion: 0.24
Nodes (2): DoshaController, DoshaReportHelper

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (2): ProfileController, ProfileService

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (2): BirthChartService, ChartController

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (1): DoshaService

### Community 7 - "Community 7"
Cohesion: 0.53
Nodes (1): AstroService

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **1 isolated node(s):** `UserController`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 9`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AstroService` connect `Community 7` to `Community 3`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `UserController` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._