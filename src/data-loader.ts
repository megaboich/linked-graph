import { Triple } from "./triple";

export class DataLoader {
  async loadData(): Promise<Triple[]> {
    const fakeData: Triple[] = [
      { object: "Olek", predicate: "works at", subject: "Semmtech" },
      { object: "Olek", predicate: "lives in", subject: "Hoofddorp" },
      { object: "Hoofddorp", predicate: "located in", subject: "Haarlemermeer" }
    ];
    return fakeData;
  }
}
