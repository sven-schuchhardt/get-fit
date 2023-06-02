// https://mikro-orm.io/docs/composite-keys#use-case-3-join-table-with-metadata

import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { WeightTrainingExercise } from "../exercises/weightTraining/WeightTrainingExercise";
import { number, object } from "yup";
import { BaseEntity } from "../abstracts/BaseEntity";
import { WeightTrainingExerciseDiaryEntry } from "../diaryEntry/WeightTrainingExerciseDiaryEntry";

@Entity()
export class DiaryEntryWeightTrainingExercise extends BaseEntity {
  @ManyToOne({
    entity: () => WeightTrainingExerciseDiaryEntry,
  })
  diaryEntry: WeightTrainingExerciseDiaryEntry;

  @ManyToOne({ entity: () => WeightTrainingExercise })
  exercise: WeightTrainingExercise;

  @Property()
  setAmount: number;

  @Property()
  repetition: number;

  constructor({
    diaryEntry,
    exercise,
    setAmount,
    repetition,
  }: CreateDiaryEntryWeightTrainingExerciseDTO) {
    super();
    this.exercise = exercise;
    this.diaryEntry = diaryEntry;
    this.setAmount = setAmount;
    this.repetition = repetition;
  }
}

export const DiaryEntryWeightTrainingExerciseSchema = object({
  setAmount: number().required(),
  repetition: number().required(),
});

export const DiaryEntryWeightTrainingExerciseSchemaUpdate = object({
  setAmount: number().notRequired(),
  repetition: number().notRequired(),
});

export type CreateDiaryEntryWeightTrainingExerciseDTO = {
  exercise: WeightTrainingExercise;
  diaryEntry: WeightTrainingExerciseDiaryEntry;
  setAmount: number;
  repetition: number;
};
