import { Graph } from "./graph-types";
import { loadGraphFromFile } from "./graph-loader";
import { toGraphDto } from "./graph-client-mapper";
import { GraphDto } from "./graph-types";
import { getRoutesWithFilter, RouteFilter } from "./routes/route-service";
import { ClientRoute } from "./routes/route-types";
import { buildRouteFilterFromQuery } from "./routes/filters/route-filter-utils";
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

  getRoutes(filter: RouteFilter) {
    return getRoutesWithFilter(filter, this.graph);
  }

  getGraphWithRoutesFromQuery(query: any): GraphWithRoutesResult {
    const filter = buildRouteFilterFromQuery(query);

    const graph = this.getGraphDto();
    const routes = this.getRoutes(filter);
    const clientRoutes: ClientRoute[] = toClientRoutes(routes);

    return {
      graph,
      routes: clientRoutes,
    };
  }
}

export interface GraphWithRoutesResult {
  graph: GraphDto;
  routes: ClientRoute[];
}
