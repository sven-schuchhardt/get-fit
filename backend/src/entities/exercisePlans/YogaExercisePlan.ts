import { Collection, Entity, OneToMany } from "@mikro-orm/core";
import { string, object, boolean } from "yup";
import { BasePlanEntity } from "../abstracts/BasePlanEntity";
import { YogaExercise } from "../exercises/yoga/YogaExercise";
import { YogaExercisePlanYogaExercise } from "../pivotTables/YogaExercisePlanYogaExercise";

@Entity({
  discriminatorValue: "yoga",
})
export class YogaExercisePlan extends BasePlanEntity {
  @OneToMany({
    entity: () => YogaExercisePlanYogaExercise,
    mappedBy: (p) => p.exercisePlan,
  })
  exercises = new Collection<YogaExercise>(this);

  constructor({ title, description, createdByUser }: YogaExercisePlanDTO) {
    super();
    this.title = title;
    this.description = description;
    this.createdByUser = createdByUser;
  }
}

export const YogaExercisePlanSchema = object({
  title: string().required(),
  description: string().required(),
  createdByUser: boolean().required(),
});

export type YogaExercisePlanDTO = {
  title: string;
  description: string;
  createdByUser: boolean;
};
