import { Node } from "../graph-types";

export type Route = {
  nodes: Node[];
  startsAtPublic: boolean;
  endsAtSink: boolean;
  hasVulnerabilities: boolean;
};

export type ClientRoute = {
  nodes: Node[];
};

export enum RouteFilterId {
  Public = "public",
  Sink = "sink",
  Vulnerable = "vulnerable",
}

export interface RouteFilterStrategy {
  id: RouteFilterId;
  apply(routes: Route[]): Route[];
}
