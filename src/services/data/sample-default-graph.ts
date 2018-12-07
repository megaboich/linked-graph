export function getDefaultGraphData() {
  const name = "Default";

  const points: string[] = ["A", "B", "C", "D"];

  const links: string[] = ["A:B", "B:C", "C:D", "A:C"];

  return { name, points, links };
}
