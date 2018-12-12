export function getCircleGraphData() {
  const name = "Circle";

  const points: string[] = ["W", "E", "B", "C", "O", "L", "A"];

  const links: string[] = ["W:E", "E:B", "B:C", "C:O", "O:L", "L:A", "A:W"];

  return { name, points, links };
}
