# backslash-TrainTicketGraph

Backend home assignment, train ticket graph.
Graph-based static analysis tool for modeling microservice communication paths, identifying attack routes, and filtering them using security-oriented constraints.
This project was implemented as part of a backend home assignment for a security-focused engineering position.

Overview

The system loads a directed graph describing microservices, databases, and internal components of the Train-Ticket application.
Each node may represent an exposed service, an internal microservice, or a sink (such as RDS/SQL). The project computes all possible routes within the graph, identifies security-relevant properties (public entry points, vulnerable nodes, and sinks), and exposes filtered routes via an HTTP API.

The project emphasizes:

Efficient route computation

Cache-based performance optimization

Extensible filtering architecture

Clean TypeScript design with strong types

Full test coverage for filtering logic

Features

Load a graph from JSON (train-ticket-be.json)

Compute all paths in the graph using DFS with cycle protection

Cache computed routes with deduplicated route structures

Tag each route with:

startsAtPublic

endsAtSink

hasVulnerabilities

Extensible filter registry (plug-in style)

Route filtering using AND logic

HTTP API for retrieving filtered routes

Jest test suite for the core filtering layer

Tech Stack

Node.js

TypeScript

Express.js

Jest

ts-node

Type-safe layered architecture

Project Structure
src/
graph/
graph-loader.ts // Loads and validates graph JSON
graph-types.ts // Node, Graph, Vulnerability types
graph-utils.ts // Helpers for node classification
compute-all-routes.ts // DFS route computation with cycle guard
route-types.ts // Route model and metadata flags
routes/
route-service.ts // Orchestrates filtering + caching
route-cache.ts // Caches all routes per graph
route-filters-registry.ts
filters/
public-filter.ts
sink-filter.ts
vulnerable-filter.ts
app.ts // Express app setup
server.ts // HTTP server
data/
train-ticket-be.json // Input graph

Installation
git clone <repo>
cd backslash-train-ticket-graph
npm install

Running the Project
npm run start

The server starts on http://localhost:3000.

API
GET /graph

Returns all routes (cached) with optional filters.

Query Parameters
Query Type Description
publicOnly boolean Only routes that start from a public-exposed service
sinkOnly boolean Only routes that end at a sink node (RDS/SQL)
vulnerableOnly boolean Only routes that pass through a vulnerable node
Example:
GET /graph?publicOnly=true&sinkOnly=true

Example Response:
[
{
"nodes": ["frontend", "order-service", "prod-postgresdb"],
"startsAtPublic": true,
"endsAtSink": true,
"hasVulnerabilities": true
}
]

How Route Filtering Works

1. Compute All Routes (once per graph)

Using DFS, avoiding cycles.

2. Apply Metadata Flags

Each route receives boolean tags:

startsAtPublic

endsAtSink

hasVulnerabilities

3. Apply Filters

Filtering is performed using AND logic:

finalRoutes = ∩ of all enabled filters

Each filter is defined as a class implementing:

interface RouteFilterMatcher {
getFilteredRoutes(routes: Route[]): Route[];
}

Filters are registered via a registry:

FILTERS_CONFIG = {
publicOnly: PublicFilter,
sinkOnly: SinkFilter,
vulnerableOnly: VulnerableFilter
}

This design allows adding new filters with zero changes to existing code.

Cache Strategy

To avoid recomputing DFS-heavy route building, the system uses a simple in-memory cache:

routesCache.getAllRoutes(graph: Graph): Route[]

Caching is invalidated only if the graph object changes.

Testing
npm run test

Test suite includes:

Filter logic tests (getRoutesWithFilter)

Intersection logic tests

Mocked routesCache for deterministic behavior

Isolation of filter classes for independent evaluation

Extending the Project
Adding a New Filter

Create a class under:

src/graph/routes/filters/my-new-filter.ts

Implement:

class MyNewFilter implements RouteFilterMatcher {
getFilteredRoutes(routes: Route[]) {
return routes.filter(/_ your condition _/);
}
}

Register it:

FILTERS_CONFIG.myNewFilter = MyNewFilter;

The API will automatically support ?myNewFilter=true

Limitations

In-memory caching only (no Redis)

Graph JSON must be well-formed and acyclic for correct route enumeration

No authentication layer for the API (not required for assignment)

Server does not validate complex metadata structures beyond basic shape
