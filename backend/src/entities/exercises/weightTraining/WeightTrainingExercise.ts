import {
  Entity,
  Property,
  ManyToOne,
} from "@mikro-orm/core";
import { string, object } from "yup";
import { BaseExerciseEntity } from "../../abstracts/BaseExerciseEntity";
import { BodyPart } from "./BodyPart";

@Entity({
  discriminatorValue: "weightTraining",
})
export class WeightTrainingExercise extends BaseExerciseEntity {
  @Property()
  muscleGroup: string;

  @Property()
  equipment: string;

  @ManyToOne({ entity: () => BodyPart, inversedBy: (bp) => bp.exercises })
  bodyPart!: BodyPart;

  constructor({
    description,
    muscleGroup,
    videoLink,
    equipment,
    imageOrGifUrl,
    name,
    createdByUser,
    bodyPart,
  }: WeightTrainingExerciseDTO) {
    super();
    this.description = description;
    this.name = name;
    this.muscleGroup = muscleGroup;
    this.videoLink = videoLink;
    this.equipment = equipment;
    this.imageOrGifUrl = imageOrGifUrl;
    this.createdByUser = createdByUser;
    this.bodyPart = bodyPart;
  }
}

export const WeightTrainingExerciseSchema = object({
  description: string().notRequired(),
  muscleGroup: string().required(),
  videoLink: string().notRequired(),
  equipment: string().required(),
  imageOrGifUrl: string().required(),
  name: string().required(),
});

export const WeightTrainingExerciseSchemaPost = object({
  description: string().notRequired(),
  muscleGroup: string().required(),
  videoLink: string().notRequired(),
  equipment: string().required(),
  imageOrGifUrl: string().required(),
  name: string().required(),
});

export const WeightTrainingExerciseSchemaUpdate = object({
  description: string().notRequired(),
  muscleGroup: string().notRequired(),
  videoLink: string().notRequired(),
  equipment: string().notRequired(),
  imageOrGifUrl: string().notRequired(),
  name: string().notRequired(),
});

export type WeightTrainingExerciseDTO = {
  description?: string;
  muscleGroup: string;
  videoLink?: string;
  equipment: string;
  imageOrGifUrl: string;
  name: string;
  createdByUser: boolean;
  bodyPart: BodyPart;
};
