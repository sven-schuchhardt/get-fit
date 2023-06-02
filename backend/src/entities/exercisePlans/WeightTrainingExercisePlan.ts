import { Collection, Entity, OneToMany } from "@mikro-orm/core";
import { string, object } from "yup";
import { BasePlanEntity } from "../abstracts/BasePlanEntity";
import { WeightTrainingExercisePlanWeightTrainingExercise } from "../pivotTables/WeightTrainingExercisePlanWeightTrainingExercise";
import { WeightTrainingExerciseDiaryEntry } from "../diaryEntry/WeightTrainingExerciseDiaryEntry";

@Entity({
  discriminatorValue: "weightTraining",
})
export class WeightTrainingExercisePlan extends BasePlanEntity {
  @OneToMany({
    entity: () => WeightTrainingExercisePlanWeightTrainingExercise,
    mappedBy: (p) => p.exercisePlan,
  })
  exercises = new Collection<WeightTrainingExercisePlanWeightTrainingExercise>(
    this
  );

  @OneToMany({
    entity: () => WeightTrainingExerciseDiaryEntry,
    mappedBy: (d) => d.weightTrainingExercisePlan,
  })
  diaryEntries = new Collection<WeightTrainingExerciseDiaryEntry>(this);

  constructor({
    title,
    description,
    createdByUser,
  }: WeightTrainingExercisePlanDTO) {
    super();
    this.title = title;
    this.description = description;
    this.createdByUser = createdByUser;
  }
}

export const WeightTrainingExercisePlanSchema = object({
  title: string().required(),
  description: string().required(),
});

export type WeightTrainingExercisePlanDTO = {
  title: string;
  description: string;
  createdByUser: boolean;
};
