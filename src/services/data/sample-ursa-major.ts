export function getUrsaMajorGraphData() {
  const name = "Ursa Major";

  const points: string[] = [
    "Alkaid",
    "Mizar",
    "Alioth",
    "Megrez",
    "Dubhe",
    "Merak",
    "Phecda"
  ];

  const links: string[] = [
    "Alkaid:Mizar",
    "Mizar:Alioth",
    "Alioth:Megrez",
    "Megrez:Dubhe",
    "Dubhe:Merak",
    "Merak:Phecda",
    "Phecda:Megrez"
  ];

  return { name, points, links };
}
