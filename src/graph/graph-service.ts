import { Graph } from "./graph-types";
import { loadGraphFromFile } from "./graph-loader";
import { toClientGraph } from "./graph-client-mapper";
import { ClientGraph } from "./graph-types";

export class GraphService {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  static fromFile(relativePath: string): GraphService {
    const graph = loadGraphFromFile(relativePath);
    return new GraphService(graph);
  }

  getClientGraph(): ClientGraph {
    return toClientGraph(this.graph);
  }
}
