import { date, object, string } from "yup";

import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { WeightTrainingExercisePlan } from "../exercisePlans/WeightTrainingExercisePlan";
import { DiaryEntryWeightTrainingExercise } from "../pivotTables/DiaryEntryWeightTrainingExercise";
import { DiaryEntry } from "../abstracts/DiaryEntry";

@Entity()
export class WeightTrainingExerciseDiaryEntry extends DiaryEntry {
  note: string;

  @Property()
  date: Date;

  @ManyToOne({
    entity: () => WeightTrainingExercisePlan,
    inversedBy: (p) => p.diaryEntries,
  })
  weightTrainingExercisePlan: WeightTrainingExercisePlan;

  @OneToMany({
    entity: () => DiaryEntryWeightTrainingExercise,
    mappedBy: (d) => d.diaryEntry,
  })
  exercises = new Collection<DiaryEntryWeightTrainingExercise>(this);

  constructor({
    weightTrainingExercisePlan,
    note,
    date,
  }: WeightTrainingExerciseDiaryEntryDTO) {
    super();
    this.note = note;
    this.date = date;
    this.weightTrainingExercisePlan = weightTrainingExercisePlan;
  }
}

export const WeightTrainingExerciseDiaryEntrySchema = object({
  date: date().required(),
  note: string().required(),
});

export const WeightTrainingExerciseDiaryEntryUpdate = object({
  date: date().notRequired(),
  note: string().notRequired(),
});

export type WeightTrainingExerciseDiaryEntryDTO = {
  weightTrainingExercisePlan: WeightTrainingExercisePlan;
  note: string;
  date: Date;
};
