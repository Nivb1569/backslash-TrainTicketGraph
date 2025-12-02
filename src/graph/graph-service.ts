import { Graph } from "./graph-types";
import { loadGraphFromFile } from "./graph-loader";
import { toGraphDto } from "./graph-client-mapper";
import { GraphDto } from "./graph-types";
import { getRoutesWithFilter, RoutesRequest } from "./routes/route-service";
import { ClientRoute } from "./routes/route-types";
import { toClientRoutes } from "./routes/route-mapper";

export class GraphService {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  static fromFile(relativePath: string): GraphService {
    const graph = loadGraphFromFile(relativePath);
    return new GraphService(graph);
  }

  getGraphDto(): GraphDto {
    return toGraphDto(this.graph);
  }

  getRoutes(request: RoutesRequest): ClientRoute[] {
    const routes = getRoutesWithFilter(request, this.graph);
    return toClientRoutes(routes);
  }

  getGraphWithRoutes(request: RoutesRequest): GraphWithRoutesResult {
    const graph = this.getGraphDto();
    const routes = this.getRoutes(request);

    return {
      graph,
      routes,
    };
  }
}

export interface GraphWithRoutesResult {
  graph: GraphDto;
  routes: ClientRoute[];
}
