import { Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

export abstract class DiaryEntry extends BaseEntity {
  @Property()
  abstract note: string;

  @Property()
  abstract date: Date;
}
