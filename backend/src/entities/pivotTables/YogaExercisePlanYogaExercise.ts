import { Entity, ManyToOne } from "@mikro-orm/core";
import { object, string } from "yup";
import { BasePivotTable, Days } from "../abstracts/BasePivotTable";
import { YogaExercisePlan } from "../exercisePlans/YogaExercisePlan";
import { YogaExercise } from "../exercises/yoga/YogaExercise";

@Entity()
export class YogaExercisePlanYogaExercise extends BasePivotTable {
  @ManyToOne({ entity: () => YogaExercisePlan })
  exercisePlan: YogaExercisePlan;

  @ManyToOne({ entity: () => YogaExercise })
  exercise: YogaExercise;

  constructor({
    exercisePlan,
    exercise,
    days,
  }: YogaExercisePlanYogaExerciseDTO) {
    super();
    this.exercisePlan = exercisePlan;
    this.exercise = exercise;
    this.days = days;
  }
}

export const YogaExercisePlanYogaExerciseSchema = object({
  day: string().required(),
});

export type YogaExercisePlanYogaExerciseDTO = {
  exercisePlan: YogaExercisePlan;
  exercise: YogaExercise;
  days: Days[];
};
