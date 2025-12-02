import { Node } from "../graph-types";

export type Route = {
  nodes: Node[];
  startsAtPublic: boolean;
  endsAtSink: boolean;
  hasVulnerabilities: boolean;
};

export type RouteDto = {
  nodes: Node[];
};

export interface RouteFilter {
  publicOnly?: boolean;
  sinkOnly?: boolean;
  vulnerableOnly?: boolean;
}
