import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseEntity } from "../../abstracts/BaseEntity";
import { WeightTrainingExercise } from "./WeightTrainingExercise";

@Entity()
export class BodyPart extends BaseEntity {
  @Property()
  bodyPart: string;

  @OneToMany({
    entity: () => WeightTrainingExercise,
    mappedBy: (e) => e.bodyPart,
  })
  exercises = new Collection<WeightTrainingExercise>(this);

  constructor({ bodyPart }: BodyPartDTO) {
    super();
    this.bodyPart = bodyPart;
  }
}

export const BodyPartSchema = object({
  bodyPart: string().required(),
});

export type BodyPartDTO = {
  bodyPart: string;
};
