import { Entity, Property } from "@mikro-orm/core";
import { object, string } from "yup";
import { BaseExerciseEntity } from "../../abstracts/BaseExerciseEntity";

@Entity({
  discriminatorValue: "yoga",
})
export class YogaExercise extends BaseExerciseEntity {
  @Property()
  sanskritName: String;

  constructor({
    sanskritName,
    description,
    name,
    videoLink,
    imageOrGifUrl,
    createdByUser,
  }: YogaExerciseDTO) {
    super();
    this.sanskritName = sanskritName;
    this.description = description;
    this.name = name;
    this.videoLink = videoLink;
    this.imageOrGifUrl = imageOrGifUrl;
    this.createdByUser = createdByUser;
  }
}

export const YogaExerciseSchema = object({
  sanskritName: string().required(),
  description: string().notRequired(),
  videoLink: string().notRequired(),
  imageOrGifUrl: string().required(),
  name: string().required(),
});

export type YogaExerciseDTO = {
  sanskritName: string;
  description?: string;
  videoLink?: string;
  imageOrGifUrl: string;
  name: string;
  createdByUser: boolean;
};
