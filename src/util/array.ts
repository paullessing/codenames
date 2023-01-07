export type Reducer<Value, Accumulator> = (
  accumulator: Accumulator,
  value: Value,
  index: number,
  array: Value[]
) => Accumulator;

export const sum = (): Reducer<number, number> => {
  return (total, value) => total + value;
};

export const indexArray = (length: number): number[] => {
  return new Array(length).fill(null).map((_, index) => index);
};
