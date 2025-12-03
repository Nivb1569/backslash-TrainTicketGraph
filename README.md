# backslash-TrainTicketGraph

Graph-based static analysis tool for modeling microservice communication paths, identifying attack routes, and filtering them using security-oriented constraints.  
This project was implemented as part of a backend home assignment for a security-oriented engineering position.

📄 **Architecture Document** — [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Overview

The system loads a directed graph describing microservices, databases, and components within the Train-Ticket application.  
It computes all possible routes inside the graph, marks each route with security metadata, caches the results for performance, and exposes the filtered output through an HTTP API.

The project focuses on:

- Efficient DFS route computation  
- In-memory caching  
- Extensible filtering infrastructure  
- Clean, strongly typed TypeScript architecture  
- REST API for graph exploration  


## Features

- Load input graph from `train-ticket-be.json`
- Compute all possible routes using DFS with cycle protection
- Cache computed routes for performance
- Annotate routes with:
  - `startsAtPublic`
  - `endsAtSink`
  - `hasVulnerabilities`
- Modular filter registry
- Apply filters using AND logic
- Express API exposing graph and route data


## Tech Stack

- **Node.js** – Runtime environment  
- **TypeScript** – Strong type safety and modern JS features  
- **Express.js** – HTTP server and routing layer  
- **ts-node** – Direct execution of TypeScript  
- **Jest** – Unit testing  


## Installation

`git clone https://github.com/Nivb1569/backslash-TrainTicketGraph.git`

`cd backslash-train-ticket-graph`

`npm install`

## Running the Project

`npm run start`

Server will run at:

`http://localhost:3000`

## API

`GET /graph`

Return the graph and all computed routes.  
Supports optional query parameters for filtering.


## Query Parameters

| Query            | Type    | Description                                           |
|------------------|---------|-------------------------------------------------------|
| `publicOnly`     | boolean | Only routes that start at a public-exposed service    |
| `sinkOnly`       | boolean | Only routes ending at a sink node (RDS/SQL)           |
| `vulnerableOnly` | boolean | Only routes that pass through a vulnerable node       |


## Example Request

`GET /graph?publicOnly=true&sinkOnly=true`

## Testing

Run tests:

`npm run test`
