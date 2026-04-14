# Design Patterns and SOLID Principles Implementation

This document outlines all the design patterns and SOLID principles implemented in the Astrology Backend project.

---

## Table of Contents

1. [Observer Pattern](#observer-pattern)
2. [Strategy Pattern](#strategy-pattern)
3. [Template Method Pattern](#template-method-pattern)
4. [Single Responsibility Principle](#single-responsibility-principle-srp)
5. [Open/Closed Principle](#openclosed-principle-ocp)
6. [Liskov Substitution Principle](#liskov-substitution-principle-lsp)
7. [Interface Segregation Principle](#interface-segregation-principle-isp)
8. [Dependency Inversion Principle](#dependency-inversion-principle-dip)
9. [Pattern Combinations](#pattern-combinations)

---

## Observer Pattern

### Definition
The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.

### Implementation in Project

In the Mongoose schema, we use the `toJSON()` method which acts as an observer - whenever the model is converted to JSON for an API response, it automatically filters out sensitive data.

**UserModel.ts:**
```typescript
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};
```

**DoshaReportModel.ts:**
```typescript
doshaReportSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.inputParams;
  delete obj.apiResponse;
  return obj;
};
```

### How It Works

1. Any controller returns a Mongoose document
2. The document is automatically serialized to JSON
3. The `toJSON()` observer method is triggered
4. Sensitive fields are automatically removed before response

### Benefits

- Decoupled filtering logic from controllers
- Automatic enforcement across all endpoints
- No need to manually filter in every controller method

---

## Strategy Pattern

### Definition
The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. The strategy allows the algorithm to vary independently from clients that use it.

### Implementation in Project

The Vedic Astro API service uses different endpoints for different dosha types. Each dosha type could be considered a different strategy for fetching dosha data.

**AstroService.ts:**
```typescript
private async callApi(endpoint: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await this.client.get(endpoint, {
    params: { ...params, api_key: vedicAstroConfig.apiKey, lang: "en" },
  });
  return response.data as Record<string, unknown>;
}

public fetchManglikDosh(params: VedicParams): Promise<Record<string, unknown>> {
  return this.callApi(DOSHA_ENDPOINT_MAP["manglik"], { ...params });
}

public fetchOtherdosha(params: VedicParams, doshaType: string): Promise<Record<string, unknown>> {
  const endpoint = DOSHA_ENDPOINT_MAP[doshaType];
  if (!endpoint) {
    throw new Error(`Invalid dosha type: ${doshaType}`);
  }
  return this.callApi(endpoint, { ...params });
}
```

### Comparison with Template Method

| Aspect | Strategy Pattern | Template Method |
|--------|-----------------|-----------------|
| Flexibility | Change behavior at runtime | Behavior fixed at compile time |
| Implementation | Composition over inheritance | Inheritance-based |
| Coupling | Loose coupling | Tight coupling |
| In Our Code | DOSHA_ENDPOINT_MAP switching | BaseController asyncHandler |

The Strategy pattern allows adding new dosha types by simply adding to the map, without changing any existing code.

---

## Template Method Pattern

### Definition
The Template Method pattern defines the skeleton of an algorithm in a base class and lets subclasses override specific steps without changing the overall algorithm structure.

### Implementation in Project

The `asyncHandler` in BaseController is a form of template method that defines the error-handling structure.

**BaseController.ts:**
```typescript
protected asyncHandler<TReq extends Request = Request>(
  fn: (req: TReq, res: Response, next: NextFunction) => Promise<Response | void>
) {
  return (req: TReq, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
```

### How It Works

1. Each controller method uses `this.asyncHandler()`
2. The handler wraps the actual method
3. Any exception is automatically caught and passed to error middleware
4. This is the same template for ALL controller methods

---

## Single Responsibility Principle (SRP)

### Definition
A class should have only one reason to change, meaning it should have only one job or responsibility.

### Implementation in Project

Each service has a focused, single responsibility.

**AstroService - Only makes API calls:**
```typescript
export class AstroService extends BaseService implements IAstroService {
  // ONLY handles API calls to external service
  private async callApi(endpoint: string, params: Record<string, unknown>) { ... }
  public fetchManglikDosh(params: VedicParams) { ... }
  public fetchOtherdosha(params: VedicParams, doshaType: string) { ... }
  public fetchBirthChart(params: VedicParams) { ... }
}
```

**DoshaService - Only handles dosha-related logic:**
```typescript
export class DoshaService extends BaseService {
  // Three separate single-responsibility methods
  public formatDate(date: Date | string): string { ... }
  public calculateSeverity(apiResponse: Record<string, unknown>): "low" | "medium" | "high" { ... }
  public formatReport(report: object): object { ... }
}
```

**BirthChartService - Only handles birth chart calculations:**
```typescript
export class BirthChartService extends BaseService {
  public formatDate(date: Date | string): string { ... }
  public isValidTimeFormat(time: string): boolean { ... }
  public convertTo24Hour(time12h: string): string { ... }
}
```

### Benefits

- Each service is focused and testable
- Changes to one service do not affect others
- Easy to understand what each service does

---

## Open/Closed Principle (OCP)

### Definition
Software entities should be open for extension but closed for modification. We should be able to add new functionality without changing existing code.

### Implementation in Project

The most important implementation is the DOSHA_ENDPOINT_MAP in AstroService.

**Before (violates OCP):**
```typescript
public fetchOtherdosha(params: VedicParams, doshaType: string) {
  switch (doshaType) {
    case "kalsarp": endpoint = vedicAstroConfig.endpoints.kalsarpDosh; break;
    case "sadesati": endpoint = vedicAstroConfig.endpoints.sadesati; break;
    case "pitradosh": endpoint = vedicAstroConfig.endpoints.pitradosh; break;
    case "nadi": endpoint = vedicAstroConfig.endpoints.nadiDosh; break;
    default: throw new Error("Invalid dosha type");
  }
}
```

**After (follows OCP):**
```typescript
const DOSHA_ENDPOINT_MAP: Record<string, string> = {
  manglik: vedicAstroConfig.endpoints.manglikDosh,
  kalsarp: vedicAstroConfig.endpoints.kalsarpDosh,
  sadesati: vedicAstroConfig.endpoints.sadesati,
  pitradosh: vedicAstroConfig.endpoints.pitradosh,
  nadi: vedicAstroConfig.endpoints.nadiDosh,
};

public fetchOtherdosha(params: VedicParams, doshaType: string): Promise<Record<string, unknown>> {
  const endpoint = DOSHA_ENDPOINT_MAP[doshaType];
  if (!endpoint) {
    throw new Error(`Invalid dosha type: ${doshaType}`);
  }
  return this.callApi(endpoint, { ...params });
}
```

### How to Extend

To add a new dosha type:
1. Add the endpoint to `vedicAstroConfig.ts`
2. Add the mapping to `DOSHA_ENDPOINT_MAP`
3. No changes to existing methods needed

---

## Liskov Substitution Principle (LSP)

### Definition
Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program. Subclasses must honor the contract of their parent class.

### Implementation in Project

All controllers extend BaseController and all services extend BaseService. They can be substituted anywhere the base class is expected.

**BaseController:**
```typescript
export abstract class BaseController {
  protected ok(res: Response, data: unknown, message?: string): Response { ... }
  protected created(res: Response, data: unknown, message?: string): Response { ... }
  protected fail(res: Response, status: number, message: string): Response { ... }
  protected asyncHandler<TReq extends Request>(fn) { ... }
}
```

**Subclasses:**
```typescript
class AstroController extends BaseController { ... }
class ProfileController extends BaseController { ... }
class ChartController extends BaseController { ... }
class DoshaController extends BaseController { ... }
class UserController extends BaseController { ... }
```

**Proof of Substitution:**
```typescript
const controller: BaseController = new ProfileController();
// Any method from BaseController works because all controllers extend it
controller.ok(res, data);
controller.created(res, data);
controller.fail(res, 400, "error");
```

### Same for Services

```typescript
class AstroService extends BaseService { ... }
class DoshaService extends BaseService { ... }
class BirthChartService extends BaseService { ... }
class ProfileService extends BaseService { ... }

const service: BaseService = new AstroService(); // Valid substitution
```

---

## Interface Segregation Principle (ISP)

### Definition
Clients should not be forced to depend on interfaces they do not use. It is better to have many small, specific interfaces than one large, general-purpose interface.

### Implementation in Project

We have separate focused interfaces rather than one large interface.

**IAstroService - Only astro-related methods:**
```typescript
export interface IAstroService {
  fetchManglikDosh(params: VedicParams): Promise<Record<string, unknown>>;
  fetchOtherdosha(params: VedicParams, doshaType: string): Promise<Record<string, unknown>>;
  fetchBirthChart(params: VedicParams): Promise<Record<string, unknown>>;
}
```

**ICacheService - Only cache-related methods:**
```typescript
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttl?: number): Promise<boolean>;
  delete(key: string): Promise<boolean>;
}
```

### Benefits

- Each interface has minimal, focused methods
- Classes implement only what they need
- Easy to understand and test

---

## Dependency Inversion Principle (DIP)

### Definition
High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

### Implementation in Project

Controllers depend on interfaces, not concrete implementations.

**Controller depends on IAstroService interface:**
```typescript
import { IAstroService } from "./interfaces/IAstroService";

export class DoshaController extends BaseController {
  constructor(private astroService: IAstroService) { ... }
  
  public checkDosha = this.asyncHandler(async (req: Request, res: Response) => {
    const reportData = await this.astroService.fetchManglikDosh(params);
    // ...
  });
}
```

**Service implements IAstroService interface:**
```typescript
export class AstroService extends BaseService implements IAstroService {
  // Implements all methods from IAstroService
}
```

### Benefits

- Easy to swap implementations
- Can mock interfaces for testing
- Decoupled code structure

---

## Pattern Combinations

### Factory + DIP

We use simple dependency injection through constructors, which is a form of Factory pattern.

```typescript
export const astroService = new AstroService(); // Factory creates instance
export const doshaService = new DoshaService(); // Factory creates instance
export const birthChartService = new BirthChartService(); // Factory creates instance

// Controllers receive services through dependency injection
class DoshaController extends BaseController {
  constructor(private astroService: IAstroService) { }
}
```

### Observer + ISP

The `toJSON()` observer method in models follows ISP - it only does what it's supposed to do (filter fields), nothing more.

```typescript
// Observer - watches for toJSON call
doshaReportSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.inputParams;  // Filter sensitive data
  delete obj.apiResponse; // Filter internal data
  return obj;
};
```

---

## Summary

| Pattern/Principle | Implementation | Location |
|-----------------|----------------|----------|
| Observer | toJSON() hook in models | UserModel, DoshaReportModel |
| Strategy | DOSHA_ENDPOINT_MAP | AstroService |
| Template Method | asyncHandler | BaseController |
| SRP | Single-responsibility services | All services |
| OCP | Endpoint mapping | AstroService |
| LSP | Base class extension | All controllers/services |
| ISP | Focused interfaces | IAstroService, ICacheService |
| DIP | Interface dependencies | All controllers |

---

*Document created for SDSE Capstone Project - April 2026*
