import { Graph } from "./graph-types";
import { loadGraphFromFile } from "./graph-loader";
import { toGraphDto } from "./graph-client-mapper";
import { GraphDto } from "./graph-types";
import { getRoutesWithFilter, RouteFilter } from "./routes/route-service";
import { RouteDto } from "./routes/route-types";
import { buildRouteFilterFromQuery } from "./routes/filters/route-filter-utils";
import { toRouteDtos } from "./routes/route-mapper";

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
    const RouteDtos: RouteDto[] = toRouteDtos(routes);

    return {
      graph,
      routes: RouteDtos,
    };
  }
}

export interface GraphWithRoutesResult {
  graph: GraphDto;
  routes: RouteDto[];
}
