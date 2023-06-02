import { Options } from "@mikro-orm/core";
import {
  WeightTrainingExerciseDiaryEntry,
  WeightTrainingExercise,
  WeightTrainingExercisePlan,
  User,
  BodyPart,
  YogaExercise,
  YogaExercisePlan,
  BaseExerciseEntity,
  BasePlanEntity,
  WeightTrainingExercisePlanWeightTrainingExercise,
  DiaryEntryWeightTrainingExercise,
} from "./entities";

const options: Options = {
  type: "mongo",
  entities: [
    User,
    WeightTrainingExerciseDiaryEntry,
    WeightTrainingExercise,
    WeightTrainingExercisePlan,
    BodyPart,
    YogaExercise,
    YogaExercisePlan,
    BaseExerciseEntity,
    BasePlanEntity,
    WeightTrainingExercisePlanWeightTrainingExercise,
    DiaryEntryWeightTrainingExercise,
  ],
  dbName: "fitness-app",
  password: process.env.mongo_password,
  user: process.env.mongo_user,
  debug: true,
  allowGlobalContext: true,
  ensureIndexes: true,
  clientUrl: process.env.mongo_url,
};

export default options;
