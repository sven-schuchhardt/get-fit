import express from "express";
import http from "http";
import {
  EntityManager,
  EntityRepository,
  RequestContext,
} from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/mongodb";
import {
  getListOfBodyParts,
  getListOfExercises,
} from "./apis/exerciseDB/exerciseDB";
import {
  WeightTrainingExerciseDiaryEntry,
  WeightTrainingExercise,
  WeightTrainingExerciseDTO,
  WeightTrainingExerciseSchema,
  User,
  WeightTrainingExercisePlan,
  BodyPart,
  BodyPartSchema,
  BodyPartDTO,
  YogaExercise,
  YogaExerciseSchema,
  YogaExerciseDTO,
  WeightTrainingExercisePlanWeightTrainingExercise,
  DiaryEntryWeightTrainingExercise,
  YogaExercisePlan,
} from "./entities";
import { logger } from "./utils/logger";
import { UserController } from "./controller/user.controller";
import {
  BodyPartController,
  weightTrainingExerciseDiaryEntryController,
  AuthController,
  WeightTrainingExerciseController,
  WeightTrainingExercisePlanController,
  WithoutAuthController,
} from "./controller";
import yoga from "./apis/yoga/yoga_api.json";
import * as admin from "firebase-admin";
import { Auth } from "./middleware/auth.middleware";
import { serviceAccount } from "./firebase.config";
import { getLink } from "./apis/youtube/youtube_api";

const PORT = 4000;
const app = express();

const ctxExercise = {
  event: "initDB",
  databaseCollection: "exercise",
};

const ctxBodyPart = {
  event: "initDB",
  databaseCollection: "bodyPart",
};

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
  weightTrainingExerciseRepository: EntityRepository<WeightTrainingExercise>;
  weightTrainingExercisePlanRepository: EntityRepository<WeightTrainingExercisePlan>;
  bodyPartRepository: EntityRepository<BodyPart>;
  weightTrainingExerciseDiaryEntryRepository: EntityRepository<WeightTrainingExerciseDiaryEntry>;
  yogaExerciseRepository: EntityRepository<YogaExercise>;
  yogaExercisePlanRepository: EntityRepository<YogaExercisePlan>;
  weightTrainingExercisePlanWeightTrainingExerciseRepository: EntityRepository<WeightTrainingExercisePlanWeightTrainingExercise>;
  diaryEntryWeightTrainingExerciseRepository: EntityRepository<DiaryEntryWeightTrainingExercise>;
};

const initializeExercises = async () => {
  logger
    .child({
      context: ctxExercise,
    })
    .info("There are no documents in the exercise collection");
  let i = 0;
  const listOfExercises: any = await getListOfExercises();

  const exercises: WeightTrainingExercise[] = [];
  for (let exercise of listOfExercises) {
    let bodyPart = await DI.bodyPartRepository.findOne({
      bodyPart: exercise.bodyPart,
    });

    if (bodyPart) {
      i++;
      exercise.muscleGroup = exercise.target;
      delete exercise.target;
      exercise.imageOrGifUrl = exercise.gifUrl;
      delete exercise.gifUrl;
      delete exercise.bodyPart;
      exercise.description = `This exercise is a default exercise. A perfect exercise for any level of knowledge in the gym.
       With the mix between core stability and increasing strength in the target areas, this exercise is perfect for any type of exercise plan.
        There are a lot variations as well`;
      const videoLink = await getLink(exercise.name);
      exercise.videoLink = videoLink ? videoLink : "";

      const validateExercisesSchema =
        await WeightTrainingExerciseSchema.validate(exercise);
      const exercisesDTO: WeightTrainingExerciseDTO = {
        ...validateExercisesSchema,
        createdByUser: false,
        bodyPart: bodyPart,
      };
      exercises.push(new WeightTrainingExercise(exercisesDTO));
    }
  }
  await DI.weightTrainingExerciseRepository.persistAndFlush(exercises);
  logger
    .child({
      context: ctxExercise,
    })
    .info(`${exercises.length} exercise documents were created`);
};

const initializeBodyPart = async () => {
  logger
    .child({
      context: ctxBodyPart,
    })
    .info("There are no documents in the bodyPart collection");

  const listOfBodyParts: any = await getListOfBodyParts();
  const bodyParts: BodyPart[] = [];
  for (let bodyPart of listOfBodyParts) {
    const validateBodyPartSchema = await BodyPartSchema.validate({ bodyPart });

    const bodyPartDTO: BodyPartDTO = {
      ...validateBodyPartSchema,
    };
    bodyParts.push(new BodyPart(bodyPartDTO));
  }
  await DI.bodyPartRepository.persistAndFlush(bodyParts);
  logger
    .child({
      context: ctxBodyPart,
    })
    .info(`${bodyParts.length} exercise documents were created`);
};

const initializeYogaExercises = async () => {
  logger
    .child({
      context: ctxBodyPart,
    })
    .info("There are no documents in the YogaExercises collection");

  const listOfYogaExercises: any = yoga;
  const yogaExercises: YogaExercise[] = [];
  for (let yogaExercise of listOfYogaExercises) {
    yogaExercise.sanskritName = yogaExercise.sanskrit_name;
    delete yogaExercise.sanskrit_name;

    yogaExercise.imageOrGifUrl = yogaExercise.img_url;
    delete yogaExercise.img_url;

    yogaExercise.name = yogaExercise.english_name;
    delete yogaExercise.english_name;

    const validateBodyPartSchema = await YogaExerciseSchema.validate({
      ...yogaExercise,
    });

    const yogaExerciseDTO: YogaExerciseDTO = {
      ...validateBodyPartSchema,
      createdByUser: false,
    };
    yogaExercises.push(new YogaExercise(yogaExerciseDTO));
  }
  await DI.bodyPartRepository.persistAndFlush(yogaExercises);
  logger
    .child({
      context: ctxBodyPart,
    })
    .info(`${yogaExercises.length} yoga exercise documents were created`);
};

const initializeData = async () => {
  const emptyCollection: number = 0;
  const countBodyParts = await DI.bodyPartRepository.count();
  if (emptyCollection == countBodyParts) {
    await initializeBodyPart();
  } else {
    logger
      .child({
        context: ctxBodyPart,
      })
      .info(`There are ${countBodyParts} documents in the BodyPart collection`);
  }

  const countExercises = await DI.weightTrainingExerciseRepository.count();
  if (emptyCollection == countExercises) {
    await initializeExercises();
  } else {
    logger
      .child({
        context: ctxExercise,
      })
      .info(`There are ${countExercises} documents in the exercise collection`);
  }

  const countYogaExercises = await DI.yogaExerciseRepository.count();
  if (emptyCollection == countYogaExercises) {
    await initializeYogaExercises();
  } else {
    logger
      .child({
        context: ctxExercise,
      })
      .info(
        `There are ${countYogaExercises} documents in the exercise collection`
      );
  }
};

export const initializeServer = async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.userRepository = DI.orm.em.getRepository(User);
  DI.weightTrainingExerciseRepository = DI.orm.em.getRepository(
    WeightTrainingExercise
  );
  DI.bodyPartRepository = DI.orm.em.getRepository(BodyPart);
  DI.yogaExerciseRepository = DI.orm.em.getRepository(YogaExercise);
  DI.weightTrainingExercisePlanRepository = DI.orm.em.getRepository(
    WeightTrainingExercisePlan
  );
  DI.weightTrainingExercisePlanWeightTrainingExerciseRepository =
    DI.orm.em.getRepository(WeightTrainingExercisePlanWeightTrainingExercise);
  DI.weightTrainingExerciseDiaryEntryRepository = DI.orm.em.getRepository(
    WeightTrainingExerciseDiaryEntry
  );
  DI.diaryEntryWeightTrainingExerciseRepository = DI.orm.em.getRepository(
    DiaryEntryWeightTrainingExercise
  );
  DI.yogaExercisePlanRepository = DI.orm.em.getRepository(YogaExercisePlan);

  if (process.env.environment !== "test") {
    await initializeData();
  }

  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.use(Auth.prepareAuthentication);

  app.use("/auth", AuthController);
  app.use("/withoutAuth", WithoutAuthController);
  app.use("/user", Auth.verifyAccess, UserController);
  app.use(
    "/weightTrainingExercisePlan",
    Auth.verifyAccess,
    WeightTrainingExercisePlanController
  );
  app.use(
    "/weightTrainingExercise",
    Auth.verifyAccess,
    WeightTrainingExerciseController
  );
  app.use("/bodyPart", Auth.verifyAccess, BodyPartController);
  app.use(
    "/weightTrainingExerciseDiaryEntry",
    Auth.verifyAccess,
    weightTrainingExerciseDiaryEntryController
  );

  DI.server = app.listen(PORT, () => {
    logger
      .child({ context: { event: "startServer" } })
      .info(`Server started on port ${PORT}`);
  });
};

if (process.env.environment !== "test") {
  initializeServer();
}
