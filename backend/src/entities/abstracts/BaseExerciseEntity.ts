import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "../User";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class BaseExerciseEntity extends BaseEntity {
  @Enum()
  type!: "yoga" | "weightTraining";

  @Property({ nullable: true })
  description?: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  videoLink?: string;

  @Property()
  imageOrGifUrl!: string;

  @Property()
  createdByUser!: boolean;

  @ManyToMany({
    entity: () => User,
    owner: true,
  })
  users = new Collection<User>(this);
}
