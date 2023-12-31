import { getRandomNumber } from "../../utils/randomNumberGenerators";

const colors = [
  "bg-sky-500",
  "bg-amber-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-orange-500",
];

export const randomColor = () => colors.at(getRandomNumber(6));
