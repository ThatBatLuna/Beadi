import { Node, Edge } from "reactflow";

function isSink(node: Node<any>) {}

export function update(nodes: Node<any>[], edges: Edge<any>[]): Node<any>[] {
  //Build graph between handles
  //Resolve dependency tree with all "sink" handles as roots

  const nodeLookup = Object.assign({}, ...nodes.map((it) => ({ [it.id]: it })));

  console.log("Hi");
  console.log(edges);
  console.log(nodes);

  // const sinkEdges = edges.filter((node) => isSink(node));

  const edgeValues = edges.map((it) => ({ [it.id]: it }));

  return nodes;
}
