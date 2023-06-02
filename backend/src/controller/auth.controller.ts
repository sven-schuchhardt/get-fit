import { wrap } from "@mikro-orm/core";
import { Router } from "express";
import { DI } from "..";
import {
  CreateWeightTrainingExercisePlanWeightTrainingExerciseDTO,
  User,
  UserDTO,
  UserSchema,
  WeightTrainingExercise,
  WeightTrainingExercisePlan,
  WeightTrainingExercisePlanDTO,
  WeightTrainingExercisePlanWeightTrainingExercise,
  YogaExercise,
  YogaExercisePlan,
  YogaExercisePlanDTO,
  YogaExercisePlanYogaExercise,
  YogaExercisePlanYogaExerciseDTO,
} from "../entities";
import { convertToEnum, logger } from "../utils";

const router = Router({ mergeParams: true });

const ctx_post = {
  controller: "User",
  request: "post",
  databaseCollection: "User",
};

async function getExercises(user: User) {
  const defaultWeightTrainingExercises =
    await DI.weightTrainingExerciseRepository.find({ createdByUser: false });
  for (const exercise of defaultWeightTrainingExercises) {
    wrap(exercise).assign({ users: [user] });
  }
  const defaultYogaExercises = await DI.yogaExerciseRepository.find({
    createdByUser: false,
  });
  for (const exercise of defaultYogaExercises) {
    wrap(exercise).assign({ users: [user] });
  }
  return { defaultWeightTrainingExercises, defaultYogaExercises };
}

async function createPlans(
  defaultWeightTrainingExercises: WeightTrainingExercise[],
  user: User,
  defaultYogaExercises: YogaExercise[]
) {
  if (defaultWeightTrainingExercises) {
    const number =
      defaultWeightTrainingExercises.length >= 5
        ? 5
        : defaultWeightTrainingExercises.length;

    await createNewWeightTrainingExercisesPlan(
      user,
      defaultWeightTrainingExercises.slice(0, number),
      "Default Weight Training Plan",
      "Default Weight Training Plan Nr 1",
      ["Mon", "Wed", "Fri"]
    );
  }

  if (defaultYogaExercises) {
    const number =
      defaultYogaExercises.length >= 5 ? 5 : defaultYogaExercises.length;

    createNewYogaExercisesPlan(
      user,
      defaultYogaExercises.slice(0, number),
      "Default Yoga Plan",
      "Default Yoga Plan Nr 1",
      ["Mon", "Wed", "Fri"]
    );
  }
}

async function createNewWeightTrainingExercisesPlan(
  user: User,
  exercises: WeightTrainingExercise[],
  description: string,
  title: string,
  days: string[],
  repetition: number = 10,
  setAmount: number = 25
) {
  const exercisePlanDTO: WeightTrainingExercisePlanDTO = {
    createdByUser: false,
    description: description,
    title: title,
  };

  const exercisePlan = new WeightTrainingExercisePlan(exercisePlanDTO);

  const weightTrainingExercisePlanWeightTrainingExercises: WeightTrainingExercisePlanWeightTrainingExercise[] =
    [];
  for (const exercise of exercises) {
    const createWeightTrainingExercisePlanWeightTrainingExerciseDTO: CreateWeightTrainingExercisePlanWeightTrainingExerciseDTO =
      {
        exercise: exercise,
        exercisePlan: exercisePlan,
        days: convertToEnum(days),
        repetition: repetition,
        setAmount: setAmount,
      };
    const weightTrainingExercisePlanWeightTrainingExercise =
      new WeightTrainingExercisePlanWeightTrainingExercise(
        createWeightTrainingExercisePlanWeightTrainingExerciseDTO
      );
    weightTrainingExercisePlanWeightTrainingExercises.push(
      weightTrainingExercisePlanWeightTrainingExercise
    );
  }

  wrap(exercisePlan).assign({
    users: user,
    exercises: weightTrainingExercisePlanWeightTrainingExercises,
  });
  await DI.weightTrainingExercisePlanRepository.persistAndFlush(exercisePlan);
}

async function createNewYogaExercisesPlan(
  user: User,
  exercises: YogaExercise[],
  description: string,
  title: string,
  days: string[]
) {
  const yogaExercisePlanYogaExercises: YogaExercisePlanYogaExercise[] = [];
  const exercisePlanDTO: YogaExercisePlanDTO = {
    createdByUser: false,
    description: description,
    title: title,
  };

  const exercisePlan = new YogaExercisePlan(exercisePlanDTO);

  for (const exercise of exercises) {
    const yogaExercisePlanYogaExerciseDTO: YogaExercisePlanYogaExerciseDTO = {
      exercise: exercise,
      exercisePlan: exercisePlan,
      days: convertToEnum(days),
    };

    const yogaExercise = new YogaExercisePlanYogaExercise(
      yogaExercisePlanYogaExerciseDTO
    );

    for (const exercise of exercises) {
      const yogaExercisePlanYogaExerciseDTO: YogaExercisePlanYogaExerciseDTO = {
        exercise: exercise,
        exercisePlan: exercisePlan,
        days: convertToEnum(days),
      };
      const yogaExercisePlanYogaExercise = new YogaExercisePlanYogaExercise(
        yogaExercisePlanYogaExerciseDTO
      );
      wrap(exercisePlan).assign({
        users: user,
        exercises: yogaExercisePlanYogaExercise,
      });
      yogaExercisePlanYogaExercises.push(yogaExercisePlanYogaExercise);
    }
  }
  wrap(exercisePlan).assign({
    users: user,
    exercises: yogaExercisePlanYogaExercises,
  });
  await DI.yogaExercisePlanRepository.persistAndFlush(exercisePlan);
}

router.post("/register", async (req, res) => {
  try {
    logger.child({ context: ctx_post }).info("Incoming post request", {
      body: req.body,
    });

    const validateUserData = await UserSchema.validate({
      ...req.body,
    });

    const createUserDTO: UserDTO = {
      ...validateUserData,
      activePlan: undefined,
    };
    const user = new User(createUserDTO);

    const { defaultWeightTrainingExercises, defaultYogaExercises } =
      await getExercises(user);

    await createPlans(
      defaultWeightTrainingExercises,
      user,
      defaultYogaExercises
    );

    await DI.userRepository.persistAndFlush(user);
    return res.status(201).send(user);
  } catch (error: any) {
    logger.child({ context: ctx_post }).error(error.message);
    return res.status(400).send({ message: error.message });
  }
});

export const AuthController = router;
