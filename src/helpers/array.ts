export function filterInPlace<T>(
  sourceArray: T[],
  filterPredicate: (item: T) => boolean
): void {
  let index = 0;
  while (index < sourceArray.length) {
    const item = sourceArray[index];
    if (filterPredicate(item)) {
      index++;
    } else {
      sourceArray.splice(index, 1);
    }
  }
}
