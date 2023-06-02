// https://mikro-orm.io/docs/composite-keys#use-case-3-join-table-with-metadata

import {
  Entity,
  ManyToOne,
  Property,
} from "@mikro-orm/core";
import { WeightTrainingExercise } from "../exercises/weightTraining/WeightTrainingExercise";
import { array, number, object, string } from "yup";
import { WeightTrainingExercisePlan } from "../exercisePlans/WeightTrainingExercisePlan";
import { BasePivotTable, Days } from "../abstracts/BasePivotTable";

@Entity()
export class WeightTrainingExercisePlanWeightTrainingExercise extends BasePivotTable {
  @ManyToOne({
    entity: () => WeightTrainingExercisePlan,
  })
  exercisePlan: WeightTrainingExercisePlan;

  @ManyToOne({ entity: () => WeightTrainingExercise })
  exercise: WeightTrainingExercise;

  @Property()
  setAmount: number;

  @Property()
  repetition: number;

  constructor({
    exercisePlan,
    exercise,
    setAmount,
    repetition,
    days,
  }: CreateWeightTrainingExercisePlanWeightTrainingExerciseDTO) {
    super();
    this.exercise = exercise;
    this.exercisePlan = exercisePlan;
    this.setAmount = setAmount;
    this.repetition = repetition;
    this.days = days;
  }
}

export const WeightTrainingExercisePlanWeightTrainingExerciseSchema = object({
  setAmount: number().required(),
  repetition: number().required(),
  days: array(string().required()).required(),
});

export const WeightTrainingExercisePlanWeightTrainingExerciseSchemaUpdate =
  object({
    setAmount: number().notRequired(),
    repetition: number().notRequired(),
    days: array(string().required()).notRequired(),
  });

export type CreateWeightTrainingExercisePlanWeightTrainingExerciseDTO = {
  exercise: WeightTrainingExercise;
  exercisePlan: WeightTrainingExercisePlan;
  setAmount: number;
  repetition: number;
  days: Days[];
};
