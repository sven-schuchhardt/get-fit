import { Enum } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

export enum Days {
  MON = "Mon",
  TUE = "Tue",
  WED = "Wed",
  THU = "Thu",
  FRI = "Fri",
  SAT = "Sat",
  Sun = "Sun",
}

export abstract class BasePivotTable extends BaseEntity {
  @Enum({ items: () => Days, array: true })
  days: Days[] = [];
}
