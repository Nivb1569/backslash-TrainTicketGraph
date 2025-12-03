# Architecture - Backslash Train Ticket Graph

This document describes the design and architecture of my solution to the Backslash backend home exercise.  
The goal is to take the Train Ticket microservices graph JSON, build an internal graph model, compute routes between services, and expose a flexible API that can filter routes based on security related properties.

---

## 1. Goals and Requirements

From the exercise description, the key requirements are:

- Load a JSON file representing a graph of microservices and their relations.
- Expose a REST API that returns a graph structure suitable for a client side application.
- Provide filters for routes:
  - Routes that start in a public service (`publicExposed: true`).
  - Routes that end in a sink (RDS or SQL).
  - Routes that contain at least one vulnerable node.
- Make the API and the implementation generic enough so that new filters can be added easily in the future.

My additional goals were:

- Keep the code base small, clear and easy to reason about.
- Isolate concerns: loading data, computing routes, filtering routes, and exposing an HTTP API.
- I chose to keep everything in memory (Maps and simple cache objects) without adding database layers, since this assignment runs in a single process and doesn't require production-scale infrastructure. This keeps the solution lightweight and easy to review.

---

## 2. High Level Architecture

At a high level, the system follows this flow:

1. Load the Train Ticket JSON file and build an in memory graph model.
2. Compute all possible routes in the graph once and cache them.
3. Pre compute metadata per route, such as whether it starts from a public service, ends in a sink, or contains a vulnerability.
4. Each API request applies the selected filters on the cached routes and returns both the filtered routes and a graph representation suitable for client-side rendering.

---

## 3. Assumptions

During the development of the solution, I made several practical assumptions to keep the scope focused and aligned with the requirements of the assignment:

### 3.1 Graph Scope and Input Format

I assumed that the system is required to work specifically with the Train Ticket microservices graph provided in the exercise.  
The JSON structure (nodes, kinds, vulnerabilities, publicExposed, adjacency) was treated as the canonical format for this assignment.

Although the implementation is not hardcoded to this specific graph, the overall design was influenced by the scale and structure of the Train Ticket dataset.  
The solution can load any other JSON file **as long as it follows the same schema**, but the optimization and metadata model were shaped around this dataset.

### 3.2 Single-Process Execution

I assumed that the service runs as a single Node.js process with no horizontal scaling or distributed architecture.  
This assumption justifies:

- Using only in-memory caching
- Avoiding external infrastructure like databases
- Keeping graph computation and caching inside the same runtime

### 3.3 Focus on Practical Extensibility

The solution was built to work well with the Train Ticket graph provided in the assignment, and not as a fully generic graph engine.  
Still, I made sure the code would be easy to extend where it matters.
For example, adding new filters or updating how sink nodes are detected.

The main goals were:

- making it simple to add **new filters**
- keeping the codebase clean and easy to understand
- allowing new features to be added without rewriting existing logic

This approach keeps the system practical and maintainable, without adding unnecessary complexity.

---

## 4. Tech Stack

- Node.js - runtime for the server.
- TypeScript - type safety and better developer experience.
- Express - lightweight HTTP server and routing.
- ts-node - running TypeScript without a separate build step.
- Jest - unit tests for the route logic.

---

## 5. Data Model

The core types are:

- `Node`  
  Represents a microservice, database or other component. Fields include:

  - `name`
  - `kind` (for example `service`, `rds`)
  - `publicExposed?: boolean`
  - `vulnerabilities?: Vulnerability[]`
  - `metadata?: Record<string, unknown>` for engine specific details.

- `Graph`  
  In memory representation of the JSON:

  - `nodesByName: Map<string, Node>`
  - `adjacency: Map<string, string[]>`

- `Route`  
  Represents a path through the graph:

  - `nodes: Node[]` - ordered list from source to target.
  - `startsAtPublic: boolean`
  - `endsAtSink: boolean`
  - `hasVulnerabilities: boolean`

- `RouteFilter` (flags)
  - `publicOnly?: boolean`
  - `sinkOnly?: boolean`
  - `vulnerableOnly?: boolean`

Using a dedicated `Route` model with extra metadata allows the filters to stay very simple and avoids recomputing properties for each request.

---

## 6. Graph Loading

The graph is loaded once on startup from `data/train-ticket-be.json`.

Main design decisions:

- Parse JSON into a strongly typed `Graph`.
- Build an adjacency list representation instead of storing edges as a flat list.

Reasoning:

- An adjacency list is a standard representation for graph algorithms and works very well with DFS.
- Storing nodes in a `Map` keyed by name makes it easy to enrich nodes or add more attributes later.

---

## 7. Route Computation Engine

Routes are computed in `compute-all-routes.ts`.

### Algorithm

- Use depth first search (DFS) starting from each node in the graph.
- Maintain a `visited` set along the current path to avoid cycles.
- Each time we reach a new node, we extend the current path and explore all outgoing edges.
- Every non empty path is considered a `Route` candidate and later enriched with security metadata.

---

## 8. Route Metadata

After computing all raw routes (just lists of nodes), each route is annotated with three boolean flags:

- `startsAtPublic`  
  True if the first node in the route has `publicExposed: true`.

- `endsAtSink`  
  True if the last node in the route is a sink.  
  At the moment, a sink is defined as a node whose `kind` matches RDS or SQL related kinds (for example `rds`).

- `hasVulnerabilities`  
  True if at least one node in the route has a non empty `vulnerabilities` array.

---

## 9. Filtering Architecture

The assignment explicitly requires the filtering layer to be generic so that new filters can be added easily.  
To support this, the filtering system in the project is built around a clear separation of responsibilities and an extendable class hierarchy inside the `filters` directory.

The filtering design consists of three main elements:

1. **`RouteFilter` flag object (from the API layer)**  
   The controller translates query parameters (`publicOnly`, `sinkOnly`, `vulnerableOnly`, etc.) into a simple typed flag object.  
   This object does not contain any logic, it only indicates which filters should be active.

2. **Filter Registry (`route-filters-registry.ts`)**  
   The registry maps each flag to a matching filter class:

   - `"publicOnly"` → `PublicFilter`
   - `"sinkOnly"` → `SinkFilter`
   - `"vulnerableOnly"` → `VulnerableFilter`

   Adding a new filter:

   - Creating a new class that extends `BaseRouteFilter`
   - Registering it in the registry under a new key  
     No existing code needs to be modified.

3. **Filter Class Hierarchy (`filters/`)**  
   All filters inherit from a shared abstract class: **`BaseRouteFilter`**.  
   This abstract class defines the common structure and enforces a unified interface for all filters:

   - It receives the list of routes in the constructor
   - It defines the method:
     ```
     getFilteredRoutes(): Route[]
     ```
   - Each concrete filter implements only its filtering predicate, keeping logic isolated and eliminating duplication

   The current filters are:

   - `PublicFilter`
   - `SinkFilter`
   - `VulnerableFilter`

   Each one overrides the abstract behavior from `BaseRouteFilter` and implements its own filtering condition.

The route service simply collects all active filters based on the registry and applies them using an **intersection-based** strategy.  
Because all filters share the same abstract interface, the service remains fully decoupled from the filtering implementation.

### Filter registry

The registry looks conceptually like this:

```ts
const FILTERS_CONFIG = {
  publicOnly: PublicFilter,
  sinkOnly: SinkFilter,
  vulnerableOnly: VulnerableFilter,
};
```

Each filter class follows the same interface:

```ts
interface RouteFilterMatcher {
  getFilteredRoutes(allRoutes: Route[]): Route[];
}
```

This allows me to:

- Add a new filter by implementing a single class and registering it in the config.
- Keep `route-service` agnostic to the specific filtering logic.

---

## 10. Cache Strategy

Route computation is the most expensive part of the system, while filtering is cheaper.  
To optimize for repeated API calls, I use an in memory cache in `route-cache.ts`.

Key decisions:

- Cache all computed routes per `Graph` instance.
- Expose a single function:

  ```ts
  routesCache.getAllRoutes(graph: Graph): Route[];
  ```

- If routes for this graph were already computed, return them from the cache.
- If not, compute them via the DFS engine, enrich with metadata, store in the cache, and then return.

---

## 11. API Design

The API is intentionally small and focused.

### Endpoint

- `GET /graph`  
   A single endpoint as required by the assignment.  
   Returns a structured graph representation that is easy for the frontend to work with,  
   along with the list of routes after applying the selected filters (if any).

### Query parameters

- `publicOnly` - if set to `"true"`, only routes that start from a public service are returned.
- `sinkOnly` - if set to `"true"`, only routes that end in a sink are returned.
- `vulnerableOnly` - if set to `"true"`, only routes that contain at least one vulnerable node are returned.

The controller:

1. Parses query parameters into a `RouteFilter` object.
2. Calls `getRoutesWithFilter(filter, graph)` from the route service.
3. Returns the filtered routes as JSON.

This design keeps the controller very thin and delegates all logic to the service layer.

---

## 12. Testing

The current test suite focuses on the core route computation logic in `computeAllRoutes`.

The tests build small, in-memory graphs and verify that:

- All expected routes are generated (including single node routes and multi hop routes).
- The total number of routes matches the expected value for each scenario.
- The per-route metadata flags are set correctly:
  - `startsAtPublic`
  - `endsAtSink`
  - `hasVulnerabilities`

As a natural next step, additional tests could be added around the filtering layer and the API responses, but they were considered out of scope for the initial implementation.

---

## 13. Limitations and Future Work

Current limitations:

- Single process, in memory cache.  
  For very large graphs or a production scale deployment, an external cache would be preferable.
- No authentication or authorization.  
  I think it's fine for exercise, but a real system would require access control.
- All data is loaded from a static JSON file at startup.  
  Dynamic discovery of services or loading graphs from a database is not in scope.

---
