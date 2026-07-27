export type ToolRecord = {
  href: string;
  name: string;
  description: string;
  label: string;
};

export const toolRecords: ToolRecord[] = [
  {
    href: "/tools/indexability-inspector",
    name: "Indexability Inspector",
    description: "Review status, robots access, directives, canonicals, and returned HTML signals.",
    label: "Public signal check",
  },
  {
    href: "/tools/redirect-chain-visualizer",
    name: "Redirect Chain Visualizer",
    description: "Follow public HTTP redirects and expose intermediate hops, loops, and failed destinations.",
    label: "Bounded redirect trace",
  },
];

export const toolByRoute = new Map(toolRecords.map((tool) => [tool.href, tool]));
