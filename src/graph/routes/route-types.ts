import { Node } from "../graph-types";

export type Route = {
  nodes: Node[];
  startsAtPublic: boolean;
  endsAtSink: boolean;
  hasVulnerabilities: boolean;
};