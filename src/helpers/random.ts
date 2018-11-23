export function getRandomNumber(minValue: number, maxValue: number) {
  return Math.round(Math.random() * (maxValue - minValue) + minValue);
}

export function getRandomName() {
  let word = getRandomWord(getRandomNumber(4, 8));
  word = word[0].toUpperCase() + word.substr(1);
  return word;
}

export function getRandomWord(length: number): string {
  const lettersOdd = [
    "q",
    "r",
    "t",
    "p",
    "s",
    "d",
    "f",
    "g",
    "h",
    "k",
    "l",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
    "ch",
    "sh",
    "zh"
  ];
  const lettersEven = [
    "e",
    "e",
    "e",
    "e",
    "y",
    "y",
    "u",
    "u",
    "i",
    "i",
    "i",
    "o",
    "o",
    "o",
    "o",
    "o",
    "o",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "oo",
    "aa"
  ];
  let result = "";
  const firstShift = getRandomNumber(0, 1);
  for (let i = 0; i < length; ++i) {
    let letter =
      (i + firstShift) % 2 == 0
        ? lettersOdd[getRandomNumber(0, lettersOdd.length - 1)]
        : lettersEven[getRandomNumber(0, lettersEven.length - 1)];
    result += letter;
  }
  return result;
}
