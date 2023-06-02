import { Router } from "express";
import {
  BasePlanEntity,
  CreateWeightTrainingExercisePlanWeightTrainingExerciseDTO,
  Days,
  User,
  WeightTrainingExercise,
  WeightTrainingExercisePlan,
  WeightTrainingExercisePlanDTO,
  WeightTrainingExercisePlanSchema,
  WeightTrainingExercisePlanWeightTrainingExercise,
  WeightTrainingExercisePlanWeightTrainingExerciseSchema,
  WeightTrainingExercisePlanWeightTrainingExerciseSchemaUpdate,
} from "../entities";
import { DI } from "..";
import { ObjectID } from "bson";
import { wrap } from "@mikro-orm/core";
import { convertToEnum, logger } from "../utils";

const ctx_get = {
  controller: "WeightTrainingExercisePlan",
  request: "get",
  databaseCollection: "WeightTrainingExercisePlan",
};

const ctx_post = {
  controller: "WeightTrainingExercisePlan",
  request: "post",
  databaseCollection: "WeightTrainingExercisePlan",
};

const ctx_put = {
  controller: "WeightTrainingExercisePlan",
  request: "put",
  databaseCollection: "WeightTrainingExercisePlan",
};

const ctx_delete = {
  controller: "WeightTrainingExercisePlan",
  request: "delete",
  databaseCollection: "WeightTrainingExercisePlan",
};

const router = Router({ mergeParams: true });

async function searchEntities(
  req: any,
  res: any,
  user: User,
  pivotTable: boolean = false
) {
  let entities: any = {};

  const exercisePlan: WeightTrainingExercisePlan | null =
    await DI.weightTrainingExercisePlanRepository.findOne({
      createdByUser: true,
      _id: new ObjectID(req.params.id),
      users: user,
    });
  if (!exercisePlan) {
    return { message: "WeightTrainingExercisePlan does not exist" };
  }
  entities["exercisePlan"] = exercisePlan;

  const exercise: WeightTrainingExercise | null =
    await DI.weightTrainingExerciseRepository.findOne({
      _id: req.body.weightTrainingExercise,
      users: user,
    });
  if (!exercise) {
    return { message: "WeightTrainingExercise does not exist" };
  }
  entities["exercise"] = exercise;

  if (pivotTable) {
    const weightTrainingExercisePlanWeightTrainingExercise: WeightTrainingExercisePlanWeightTrainingExercise | null =
      await DI.weightTrainingExercisePlanWeightTrainingExerciseRepository.findOne(
        {
          exercisePlan: exercisePlan,
          exercise: exercise,
        }
      );
    if (!weightTrainingExercisePlanWeightTrainingExercise) {
      return {
        message:
          "WeightTrainingExercisePlanWeightTrainingExercise does not exist",
      };
    }
    entities["weightTrainingExercisePlanWeightTrainingExercise"] =
      weightTrainingExercisePlanWeightTrainingExercise;
  }

  return entities;
}

router.get("/one/:id", async (req, res) => {
  logger.child({ context: ctx_get }).info("Incoming get request", {
    id: req.params.id,
  });
  const user: User = req.user;
  const exercisePlan: WeightTrainingExercisePlan | null =
    await DI.weightTrainingExercisePlanRepository.findOne({
      _id: new ObjectID(req.params.id),
      users: user,
    });

  if (!exercisePlan) {
    logger
      .child({ context: ctx_get })
      .info("WeightTrainingExercisePlan does not exist", {
        id: req.params.id,
      });
    return res
      .status(404)
      .send({ message: "WeightTrainingExercisePlan does not exist" });
  }
  logger.child({ context: ctx_get }).info("send WeightTrainingExercisePlan", {
    id: req.params.id,
  });
  await DI.weightTrainingExercisePlanRepository.populate(exercisePlan, [
    "exercises.exercise.bodyPart",
    "diaryEntries",
  ]);
  return res.status(200).send(exercisePlan);
});

router.get("/allByUser", async (req, res) => {
  try {
    logger.child({ context: ctx_get }).info("Incoming get request", {
      id: req.user._id,
    });
    const user = req.user;
    const exercisePlans: WeightTrainingExercisePlan[] =
      await DI.weightTrainingExercisePlanRepository.find({
        users: user,
      });
    if (!exercisePlans) {
      logger
        .child({ context: ctx_get })
        .info("WeightTrainingExercisePlan does not exist", {
          id: req.user._id,
        });
      return res
        .status(404)
        .send({ message: "WeightTrainingExercisePlan does not exist" });
    }

    logger.child({ context: ctx_get }).info("send WeightTrainingExercisePlan", {
      id: req.user._id,
    });
    await DI.weightTrainingExercisePlanRepository.populate(exercisePlans, [
      "exercises.exercise",
      "diaryEntries",
    ]);
    return res.status(200).send(exercisePlans);
  } catch (error: any) {
    logger
      .child({ context: ctx_get })
      .error(`${error.message}`, { id: req.user._id });
    return res.status(400).send({ message: error.message });
  }
});

router.get("/allCreatedByUser/", async (req, res) => {
  try {
    logger.child({ context: ctx_get }).info("Incoming get request", {
      id: req.user._id,
    });
    const user = req.user;
    const exercisePlans: WeightTrainingExercisePlan[] =
      await DI.weightTrainingExercisePlanRepository.find({
        createdByUser: true,
        users: user,
      });
    if (!exercisePlans) {
      logger
        .child({ context: ctx_get })
        .info("WeightTrainingExercisePlan does not exist", {
          id: req.user._id,
        });
      return res
        .status(404)
        .send({ message: "WeightTrainingExercisePlan does not exist" });
    }

    logger.child({ context: ctx_get }).info("send WeightTrainingExercisePlan", {
      id: req.user._id,
    });
    await DI.weightTrainingExercisePlanRepository.populate(exercisePlans, [
      "exercises.exercise",
      "diaryEntries",
    ]);
    return res.status(200).send(exercisePlans);
  } catch (error: any) {
    logger
      .child({ context: ctx_get })
      .error(`${error.message}`, { id: req.user._id });
    return res.status(400).send({ message: error.message });
  }
});

router.get("/allDefaultByUser", async (req, res) => {
  try {
    logger.child({ context: ctx_get }).info("Incoming get request", {
      id: req.user._id,
    });
    const user: User = req.user;
    const exercisePlans: WeightTrainingExercisePlan[] =
      await DI.weightTrainingExercisePlanRepository.find({
        createdByUser: false,
        users: user,
      });
    if (!exercisePlans) {
      logger
        .child({ context: ctx_get })
        .info("WeightTrainingExercisePlan does not exist", {
          id: req.user._id,
        });
      return res
        .status(404)
        .send({ message: "WeightTrainingExercisePlan does not exist" });
    }

    logger.child({ context: ctx_get }).info("send WeightTrainingExercisePlan", {
      id: req.user._id,
    });
    await DI.weightTrainingExercisePlanRepository.populate(exercisePlans, [
      "exercises.exercise",
      "diaryEntries",
    ]);
    return res.status(200).send(exercisePlans);
  } catch (error: any) {
    logger
      .child({ context: ctx_get })
      .error(`${error.message}`, { id: req.user._id });
    return res.status(400).send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    logger.child({ context: ctx_post }).info("Incoming post request", {
      body: req.body,
    });
    const user = req.user;
    const validateExercisePlanData =
      await WeightTrainingExercisePlanSchema.validate(req.body);

    const exercisePlanDTO: WeightTrainingExercisePlanDTO = {
      ...validateExercisePlanData,
      createdByUser: true,
    };

    const exercisePlan = new WeightTrainingExercisePlan(exercisePlanDTO);

    exercisePlan.users.add(user);
    await DI.weightTrainingExercisePlanRepository.persistAndFlush(exercisePlan);
    await DI.weightTrainingExercisePlanRepository.populate(exercisePlan, [
      "exercises",
      "diaryEntries",
      "users",
    ]);
    logger
      .child({ context: ctx_post })
      .info("send WeightTrainingExercisePlan", {
        id: exercisePlan._id,
      });
    return res.status(201).send(exercisePlan);
  } catch (error: any) {
    logger.child({ context: ctx_get }).error(`${error.message}`);
    return res.status(400).send({ message: error.message });
  }
});

router.put("/addExercise/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_put }).info("Incoming put request", {
      id: req.params.id,
      body: req.body,
    });
    const user: User = req.user;
    const { exercise, exercisePlan, message } = await searchEntities(
      req,
      res,
      user
    );
    if (message) {
      logger.child({ context: ctx_put }).info(message, {
        id: req.params.id,
      });
      return res.status(404).send({ message });
    }

    const validateWeightTrainingExercisePlanWeightTrainingExerciseSchema =
      await WeightTrainingExercisePlanWeightTrainingExerciseSchema.validate(
        req.body
      );

    const days = convertToEnum(
      validateWeightTrainingExercisePlanWeightTrainingExerciseSchema.days
    );
    const createWeightTrainingExercisePlanWeightTrainingExerciseDTO: CreateWeightTrainingExercisePlanWeightTrainingExerciseDTO =
      {
        ...validateWeightTrainingExercisePlanWeightTrainingExerciseSchema,
        exercise: exercise,
        exercisePlan: exercisePlan,
        days: days,
      };

    const weightTrainingExercisePlanWeightTrainingExercise =
      new WeightTrainingExercisePlanWeightTrainingExercise(
        createWeightTrainingExercisePlanWeightTrainingExerciseDTO
      );

    DI.weightTrainingExercisePlanWeightTrainingExerciseRepository.persist(
      weightTrainingExercisePlanWeightTrainingExercise
    );

    await DI.weightTrainingExercisePlanRepository.persistAndFlush(exercisePlan);

    await DI.weightTrainingExercisePlanRepository.populate(exercisePlan, [
      "exercises",
      "diaryEntries",
    ]);
    logger.child({ context: ctx_put }).info("send WeightTrainingExercisePlan", {
      id: exercisePlan._id,
    });
    return res.status(200).send(exercisePlan);
  } catch (error: any) {
    logger.child({ context: ctx_get }).error(`${error.message}`);
    return res.status(400).send({ message: error.message });
  }
});

router.put("/updateExercise/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_put }).info("Incoming put request", {
      id: req.params.id,
      body: req.body,
    });
    const user: User = req.user;
    const {
      exercisePlan,
      weightTrainingExercisePlanWeightTrainingExercise,
      message,
    } = await searchEntities(req, res, user, true);
    if (message) {
      logger.child({ context: ctx_put }).info(message, {
        id: req.params.id,
      });
      return res.status(404).send({ message });
    }

    const validateWeightTrainingExercisePlanWeightTrainingExercise =
      await WeightTrainingExercisePlanWeightTrainingExerciseSchemaUpdate.validate(
        req.body
      );

    let days;
    if (validateWeightTrainingExercisePlanWeightTrainingExercise.days) {
      days = convertToEnum(
        validateWeightTrainingExercisePlanWeightTrainingExercise.days
      );
    }
    wrap(weightTrainingExercisePlanWeightTrainingExercise).assign({
      ...validateWeightTrainingExercisePlanWeightTrainingExercise,
      days: days,
    });

    await DI.weightTrainingExercisePlanWeightTrainingExerciseRepository.flush();
    await DI.weightTrainingExercisePlanRepository.populate(exercisePlan, [
      "exercises",
      "diaryEntries",
    ]);
    logger.child({ context: ctx_put }).info("send WeightTrainingExercisePlan", {
      id: exercisePlan._id,
    });
    return res.status(200).send(exercisePlan);
  } catch (error: any) {
    logger.child({ context: ctx_get }).error(`${error.message}`);
    return res.status(400).send({ message: error.message });
  }
});

router.put("/removeExercise/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_put }).info("Incoming put request", {
      id: req.params.id,
      body: req.body,
    });
    const user: User = req.user;
    const {
      exercisePlan,
      weightTrainingExercisePlanWeightTrainingExercise,
      message,
    } = await searchEntities(req, res, user, true);
    if (message) {
      logger.child({ context: ctx_put }).info(message, {
        id: req.params.id,
      });
      return res.status(404).send({ message });
    }

    await DI.weightTrainingExercisePlanWeightTrainingExerciseRepository.removeAndFlush(
      weightTrainingExercisePlanWeightTrainingExercise
    );

    await DI.weightTrainingExercisePlanRepository.populate(exercisePlan, [
      "exercises",
      "diaryEntries",
    ]);
    logger.child({ context: ctx_put }).info("send WeightTrainingExercisePlan", {
      id: exercisePlan._id,
    });
    return res.status(200).send(exercisePlan);
  } catch (error: any) {
    logger.child({ context: ctx_get }).error(`${error.message}`);
    return res.status(400).send({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_delete }).info("Incoming delete request", {
      id: req.params.id,
    });
    const user: User = req.user;
    const exercisePlan: WeightTrainingExercisePlan | null =
      await DI.weightTrainingExercisePlanRepository.findOne({
        createdByUser: true,
        _id: new ObjectID(req.params.id),
        users: user,
      });
    if (!exercisePlan) {
      logger
        .child({ context: ctx_delete })
        .info("WeightTrainingExercisePlan does not exist", {
          id: req.params.id,
        });
      return res
        .status(404)
        .send({ message: "WeightTrainingExercisePlan does not exist" });
    }
    const allExercises =
      await DI.weightTrainingExercisePlanWeightTrainingExerciseRepository.find({
        exercisePlan: exercisePlan,
      });

    DI.weightTrainingExercisePlanWeightTrainingExerciseRepository.remove(
      allExercises
    );
    await DI.weightTrainingExercisePlanRepository.removeAndFlush(exercisePlan);

    logger
      .child({ context: ctx_delete })
      .info("WeightTrainingExercisePlan deleted", {
        id: req.params.id,
      });
    return res.status(204).send({});
  } catch (error: any) {
    logger.child({ context: ctx_get }).error(`${error.message}`);
    return res.status(400).send({ message: error.message });
  }
});

export const WeightTrainingExercisePlanController = router;
