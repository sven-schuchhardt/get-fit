import { string, object } from "yup";
import { BaseEntity } from "./abstracts/BaseEntity";
import {
  Entity,
  Property,
  ManyToMany,
  Collection,
  ManyToOne,
} from "@mikro-orm/core";
import { BaseExerciseEntity } from "./abstracts/BaseExerciseEntity";
import { BasePlanEntity } from "./abstracts/BasePlanEntity";

@Entity()
export class User extends BaseEntity {
  @Property()
  firebaseUid: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property()
  birthday: string;

  @Property()
  email: string;

  @ManyToOne({ entity: () => BasePlanEntity, nullable: true })
  activePlan?: BasePlanEntity;

  @ManyToMany({ entity: () => BasePlanEntity })
  exercisePlans = new Collection<BasePlanEntity>(this);

  @ManyToMany({
    entity: () => BaseExerciseEntity,
  })
  exercises = new Collection<BaseExerciseEntity>(this);

  constructor({
    firebaseUid,
    firstName,
    lastName,
    birthday,
    email,
    activePlan,
  }: UserDTO) {
    super();
    this.firebaseUid = firebaseUid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthday = birthday;
    this.email = email;
    this.activePlan = activePlan;
  }
}

export const UserSchema = object({
  firebaseUid: string().required(),
  firstName: string().required(),
  lastName: string().required(),
  birthday: string().required(),
  email: string().required(),
});

export const UserSchemaUpdate = object({
  firstName: string().notRequired(),
  lastName: string().notRequired(),
  birthday: string().notRequired(),
  email: string().notRequired(),
});

export type UserDTO = {
  firebaseUid: string;
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  activePlan: BasePlanEntity | undefined;
};
