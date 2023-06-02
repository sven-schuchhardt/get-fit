import { Days } from "../entities";

export function convertToEnum(days: string[]): Days[] {
  const result: Days[] = [];
  for (const day of days) {
    const enumValue = Days[day.toUpperCase() as keyof typeof Days];
    if (enumValue) {
      result.push(enumValue);
    }
  }
  return result;
}
