import { Graph, Node} from "../graph-types";
import { Route } from "./route-types";
import { isPublicNode, isSinkNode, nodeHasVulnerabilities } from "../graph-utils";

export interface RouteFilter {
  publicOnly?: boolean;
  sinkOnly?: boolean;
  vulnerableOnly?: boolean;
}