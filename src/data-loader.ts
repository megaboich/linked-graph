import { Triple } from "./triple";

export class DataLoader {
  async loadData(): Promise<Triple[]> {
    const fakeData: Triple[] = [
      { subject: "Olek", predicate: "works at", object: "Semmtech" },
      { subject: "Olek", predicate: "lives in", object: "Hoofddorp" },
      { subject: "Hoofddorp", predicate: "located in", object: "Haarlemermeer" }
    ];
    return fakeData;
  }
}
