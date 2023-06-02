import { Router } from "express";
import { DI } from "..";
import { logger } from "../utils/logger";

const router = Router({ mergeParams: true });

const ctx_get = {
  controller: "WeightTrainingExercise",
  request: "get",
  databaseCollection: "WeightTrainingExercise",
};

router.get("/weightTrainingExercises/allDefault", async (req, res) => {
  try {
    const weightTrainingExercises =
      await DI.weightTrainingExerciseRepository.find({
        createdByUser: false,
      });
    logger
      .child({
        context: ctx_get,
      })
      .info("Send all WeightTrainingExercises");
    await DI.weightTrainingExerciseRepository.populate(
      weightTrainingExercises,
      ["bodyPart"]
    );
    res.status(200).send(weightTrainingExercises);
  } catch (error: any) {
    logger
      .child({
        context: ctx_get,
      })
      .info("Error", { error });
    res.status(400).send({ message: error.message });
  }
});

router.get("/yogaExercises/allDefault", async (req, res) => {
  try {
    const yogaExercises = await DI.yogaExerciseRepository.find({
      createdByUser: false,
    });
    logger.child({
      context: ctx_get,
    });
    res.status(200).send(yogaExercises);
  } catch (error: any) {
    logger
      .child({
        context: ctx_get,
      })
      .info("Error", { error });
    res.status(400).send({ message: error.message });
  }
});

export const WithoutAuthController = router;
