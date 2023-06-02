import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "../User";

@Entity({
  discriminatorColumn: "type",
  abstract: true,
})
export abstract class BasePlanEntity extends BaseEntity {
  @Enum()
  type!: "yoga" | "weightTraining";

  @Property()
  title?: string;

  @Property()
  description?: string;

  @Property()
  createdByUser: boolean = false;

  @ManyToMany({
    entity: () => User,
    owner: true,
  })
  users = new Collection<User>(this);

  @OneToMany({ entity: () => User, mappedBy: "activePlan" })
  activePlanUsers = new Collection<User>(this);
}
