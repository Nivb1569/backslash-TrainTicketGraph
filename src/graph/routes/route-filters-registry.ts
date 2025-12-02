import { BaseRouteFilter } from "./filters/base-route-filter";
import { PublicFilter } from "./filters/public-filter";
import { SinkFilter } from "./filters/sink-filter";
import { VulnerableFilter } from "./filters/vulnerability-filter";

export type RouteFilterFlag = "publicOnly" | "sinkOnly" | "vulnerableOnly";

export interface RouteFilterConfig {
  flag: RouteFilterFlag;
  filter: BaseRouteFilter;
}

const publicFilter = new PublicFilter();
const sinkFilter = new SinkFilter();
const vulnerableFilter = new VulnerableFilter();

export const FILTERS_CONFIG: RouteFilterConfig[] = [
  { flag: "publicOnly", filter: publicFilter },
  { flag: "sinkOnly", filter: sinkFilter },
  { flag: "vulnerableOnly", filter: vulnerableFilter },
];
