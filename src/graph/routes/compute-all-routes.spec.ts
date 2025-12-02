import { computeAllRoutes } from "./compute-all-routes";
import { Graph, Node } from "../graph-types";

function buildGraph(nodes: Node[], edges: Array<[string, string[]]>): Graph {
  const nodesByName = new Map<string, Node>();
  for (const node of nodes) {
    nodesByName.set(node.name, node);
  }

  const adjacency = new Map<string, string[]>();
  for (const [from, tos] of edges) {
    adjacency.set(from, tos);
  }

  return { nodesByName, adjacency };
}

describe("computeAllRoutes", () => {
  test("simple chain with public start, vulnerable middle and sink end", () => {
    const frontend: Node = {
      name: "frontend",
      kind: "service",
      publicExposed: true,
    };

    const orderService: Node = {
      name: "order-service",
      kind: "service",
      vulnerabilities: [
        {
          file: "order.ts",
          severity: "high",
          message: "test vuln",
        },
      ],
    };

    const db: Node = {
      name: "prod-postgresdb",
      kind: "rds",
    };

    const graph: Graph = buildGraph(
      [frontend, orderService, db],
      [
        ["frontend", ["order-service"]],
        ["order-service", ["prod-postgresdb"]],
      ]
    );

    const routes = computeAllRoutes(graph);

    expect(routes.length).toBe(6);

    const asStrings = routes.map((r) => r.nodes.map((n) => n.name).join("->"));

    expect(asStrings).toEqual(
      expect.arrayContaining([
        "frontend",
        "frontend->order-service",
        "frontend->order-service->prod-postgresdb",
        "order-service",
        "order-service->prod-postgresdb",
        "prod-postgresdb",
      ])
    );

    const fullRoute = routes.find(
      (r) => r.nodes.map((n) => n.name).join("->") === "frontend->order-service->prod-postgresdb"
    );
    expect(fullRoute).toBeDefined();
    expect(fullRoute!.startsAtPublic).toBe(true);
    expect(fullRoute!.endsAtSink).toBe(true);
    expect(fullRoute!.hasVulnerabilities).toBe(true);

    const orderOnly = routes.find(
      (r) => r.nodes.length === 1 && r.nodes[0]!.name === "order-service"
    );
    expect(orderOnly).toBeDefined();
    expect(orderOnly!.startsAtPublic).toBe(false);
    expect(orderOnly!.endsAtSink).toBe(false);
    expect(orderOnly!.hasVulnerabilities).toBe(true);

    const dbOnly = routes.find(
      (r) => r.nodes.length === 1 && r.nodes[0]!.name === "prod-postgresdb"
    );
    expect(dbOnly).toBeDefined();
    expect(dbOnly!.startsAtPublic).toBe(false);
    expect(dbOnly!.endsAtSink).toBe(true);
    expect(dbOnly!.hasVulnerabilities).toBe(false);
  });
});
