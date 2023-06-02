import { wrap } from "@mikro-orm/core";
import { ObjectID } from "bson";
import { Router } from "express";
import { DI } from "..";
import {
  User,
  WeightTrainingExerciseDiaryEntry,
  WeightTrainingExerciseDiaryEntryDTO,
  WeightTrainingExerciseDiaryEntrySchema,
  WeightTrainingExerciseDiaryEntryUpdate,
  WeightTrainingExercisePlan,
} from "../entities";
import {
  CreateDiaryEntryWeightTrainingExerciseDTO,
  DiaryEntryWeightTrainingExercise,
  DiaryEntryWeightTrainingExerciseSchema,
  DiaryEntryWeightTrainingExerciseSchemaUpdate,
} from "../entities/pivotTables/DiaryEntryWeightTrainingExercise";
import { logger } from "../utils";

const router = Router({ mergeParams: true });

const ctx_get = {
  controller: "DiaryEntry",
  request: "get",
  databaseCollection: "DiaryEntry",
};

const ctx_post = {
  controller: "DiaryEntry",
  request: "post",
  databaseCollection: "DiaryEntry",
};

const ctx_put = {
  controller: "DiaryEntry",
  request: "put",
  databaseCollection: "DiaryEntry",
};

const ctx_delete = {
  controller: "DiaryEntry",
  request: "delete",
  databaseCollection: "DiaryEntry",
};

router.get("/getSummarizedDataLastSevenDays", async (req, res) => {
  try {
    logger.child({ context: ctx_get }).info("Get all DiaryEntries");
    const diaryEntries: any[] = [];
    const user: User = req.user;
    const activePlan: WeightTrainingExercisePlan | undefined =
      user.activePlan as WeightTrainingExercisePlan;
    if (!activePlan) {
      return res
        .status(404)
        .send({ message: "No active weight training exercise plan found" });
    }
    const currentDate: Date = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = currentDate.toISOString();
      const diaryEntry =
        await DI.weightTrainingExerciseDiaryEntryRepository.findOne({
          date: currentDate,
          weightTrainingExercisePlan: activePlan,
        });
      if (diaryEntry) {
        let amount = 0;
        let repetition = 0;
        await DI.weightTrainingExerciseDiaryEntryRepository.populate(
          diaryEntry,
          ["exercises.exercise", "weightTrainingExercisePlan"]
        );
        for (let exercise of diaryEntry.exercises) {
          amount += exercise.setAmount;
          repetition += exercise.repetition;
        }
        diaryEntries.push({ diaryEntry, amount, repetition });
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    diaryEntries.reverse();
    logger.child({ context: ctx_get }).info("Get all DiaryEntries", {
      diaryEntries,
    });
    return res.status(200).send(diaryEntries);
  } catch (error: any) {
    logger.child({ context: ctx_post }).error({ message: error.message });
    return res.status(400).send({ message: error.message });
  }
});

router.get("/byDatePlanUser/:id", async (req, res) => {
  try {
    logger
      .child({ context: ctx_get })
      .info("Get all DiaryEntries", { body: req.body });
    const user: User = req.user;
    const weightTrainingExercisePlan =
      await DI.weightTrainingExercisePlanRepository.findOne({
        users: user,
        _id: new ObjectID(req.params.id),
      });
    if (!weightTrainingExercisePlan) {
      logger
        .child({ context: ctx_post })
        .error("WeightTrainingExercisePlan does not exist");
      return res
        .status(404)
        .send({ message: "WeightTrainingExercisePlan does not exist" });
    }

    const date: Date = new Date(req.body.date);
    date.setHours(0, 0, 0, 0);
    const diaryEntry =
      await DI.weightTrainingExerciseDiaryEntryRepository.findOne({
        date: date,
        weightTrainingExercisePlan: weightTrainingExercisePlan,
      });
    if (!diaryEntry) {
      logger.child({ context: ctx_post }).error("DiaryEntry does not exist");
      return res.status(404).send({ message: "DiaryEntry does not exist" });
    }

    await DI.weightTrainingExerciseDiaryEntryRepository.populate(diaryEntry, [
      "weightTrainingExercisePlan",
      "exercises.exercise",
    ]);
    logger.child({ context: ctx_post }).info("DiaryEntry found", {
      diaryEntry: diaryEntry,
    });
    return res.status(200).send(diaryEntry);
  } catch (error: any) {
    logger.child({ context: ctx_post }).error({ message: error.message });
    return res.status(400).send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    logger.child({ context: ctx_post }).info("Incoming post request", {
      body: req.body,
    });
    const date = new Date(req.body.date);
    const weightTrainingExercisePlan =
      await DI.weightTrainingExercisePlanRepository.findOne(
        req.body.weightTrainingExercisePlan
      );
    if (!weightTrainingExercisePlan) {
      logger
        .child({ context: ctx_post })
        .error("WeightTrainingExercisePlan does not exist");
      return res
        .status(404)
        .send({ message: "WeightTrainingExercisePlan does not exist" });
    }

    const validateDiaryEntrySchema =
      await WeightTrainingExerciseDiaryEntrySchema.validate({
        ...req.body,
        date: date,
      });

    const diaryEntryDTO: WeightTrainingExerciseDiaryEntryDTO = {
      ...validateDiaryEntrySchema,
      weightTrainingExercisePlan: weightTrainingExercisePlan,
    };
    const diaryEntry = new WeightTrainingExerciseDiaryEntry(diaryEntryDTO);

    await DI.weightTrainingExerciseDiaryEntryRepository.persistAndFlush(
      diaryEntry
    );
    DI.weightTrainingExerciseDiaryEntryRepository.populate(diaryEntry, [
      "weightTrainingExercisePlan",
    ]);
    logger.child({ context: ctx_post }).info("DiaryEntry created", {
      diaryEntry: diaryEntry,
    });
    return res.status(201).send(diaryEntry);
  } catch (error: any) {
    logger.child({ context: ctx_post }).error({ message: error.message });
    return res.status(400).send({ message: error.message });
  }
});

router.put("/updateDiaryEntry/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_put }).info("Incoming put request", {
      body: req.body,
    });
    const diaryEntry =
      await DI.weightTrainingExerciseDiaryEntryRepository.findOne(
        req.params.id
      );
    if (!diaryEntry) {
      logger.child({ context: ctx_put }).error("DiaryEntry does not exist");
      return res.status(404).send({ message: "DiaryEntry does not exist" });
    }

    let validateDiaryEntrySchema;
    if (req.body.date) {
      const date = new Date(req.body.date);
      validateDiaryEntrySchema =
        await WeightTrainingExerciseDiaryEntryUpdate.validate({
          ...req.body,
          date: date,
        });
    } else {
      validateDiaryEntrySchema =
        await WeightTrainingExerciseDiaryEntryUpdate.validate(req.body);
    }

    wrap(diaryEntry).assign({ ...validateDiaryEntrySchema });
    await DI.weightTrainingExerciseDiaryEntryRepository.flush();
    await DI.weightTrainingExerciseDiaryEntryRepository.populate(diaryEntry, [
      "weightTrainingExercisePlan",
    ]);
    logger.child({ context: ctx_put }).info("DiaryEntry updated", {
      diaryEntry: diaryEntry,
    });
    return res.status(200).send(diaryEntry);
  } catch (error: any) {
    logger.child({ context: ctx_put }).error(error);
    return res.status(400).send(error.message);
  }
});

router.put("/addRepetitionAndAmount/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_put }).info("Incoming put request", {
      body: req.body,
    });

    const diaryEntry =
      await DI.weightTrainingExerciseDiaryEntryRepository.findOne(
        req.params.id
      );
    if (!diaryEntry) {
      logger.child({ context: ctx_put }).error("DiaryEntry does not exist");
      return res.status(404).send({ message: "DiaryEntry does not exist" });
    }
    const weightTrainingExercise =
      await DI.weightTrainingExerciseRepository.findOne(
        req.body.weightTrainingExercise
      );
    if (!weightTrainingExercise) {
      logger
        .child({ context: ctx_put })
        .error("WeightTrainingExercise does not exist");
      return res
        .status(404)
        .send({ message: "WeightTrainingExercise does not exist" });
    }

    const validateDiaryEntryWeightTrainingExercise =
      await DiaryEntryWeightTrainingExerciseSchema.validate(req.body);
    const createDiaryEntryWeightTrainingExerciseDTO: CreateDiaryEntryWeightTrainingExerciseDTO =
      {
        ...validateDiaryEntryWeightTrainingExercise,
        diaryEntry: diaryEntry,
        exercise: weightTrainingExercise,
      };

    const diaryEntryWeightTrainingExercise =
      new DiaryEntryWeightTrainingExercise(
        createDiaryEntryWeightTrainingExerciseDTO
      );

    await DI.diaryEntryWeightTrainingExerciseRepository.persistAndFlush(
      diaryEntryWeightTrainingExercise
    );

    await DI.weightTrainingExerciseDiaryEntryRepository.populate(diaryEntry, [
      "exercises.exercise",
      "weightTrainingExercisePlan",
    ]);
    logger.child({ context: ctx_put }).info("DiaryEntry updated", {
      diaryEntry: diaryEntry,
    });
    return res.status(200).send(diaryEntry);
  } catch (error: any) {
    logger.child({ context: ctx_put }).error(error);
    return res.status(400).send({ message: error.message });
  }
});

router.put("/updateRepetitionAndAmount/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_put }).info("Incoming put request", {
      body: req.body,
    });
    const diaryEntry =
      await DI.weightTrainingExerciseDiaryEntryRepository.findOne(
        req.params.id
      );
    if (!diaryEntry) {
      logger.child({ context: ctx_put }).error("DiaryEntry does not exist");
      return res.status(404).send({ message: "DiaryEntry does not exist" });
    }

    const weightTrainingExercise =
      await DI.weightTrainingExerciseRepository.findOne(
        req.body.weightTrainingExercise
      );
    if (!weightTrainingExercise) {
      logger
        .child({ context: ctx_put })
        .error("WeightTrainingExercise does not exist");
      return res
        .status(404)
        .send({ message: "WeightTrainingExercise does not exist" });
    }

    const diaryEntryWeightTrainingExercise =
      await DI.diaryEntryWeightTrainingExerciseRepository.findOne({
        diaryEntry: diaryEntry,
        exercise: weightTrainingExercise,
      });
    if (!diaryEntryWeightTrainingExercise) {
      logger
        .child({ context: ctx_put })
        .error("DiaryEntryWeightTrainingExercise does not exist");
      return res
        .status(404)
        .send({ message: "DiaryEntryWeightTrainingExercise does not exist" });
    }

    const validateDiaryEntryWeightTrainingExercise =
      await DiaryEntryWeightTrainingExerciseSchemaUpdate.validate(req.body);

    wrap(diaryEntryWeightTrainingExercise).assign({
      ...validateDiaryEntryWeightTrainingExercise,
    });

    await DI.weightTrainingExerciseDiaryEntryRepository.populate(diaryEntry, [
      "exercises.exercise",
      "weightTrainingExercisePlan",
    ]);
    logger.child({ context: ctx_put }).info("DiaryEntry updated", {
      diaryEntry: diaryEntry,
    });
    return res.status(200).send(diaryEntry);
  } catch (error: any) {
    logger.child({ context: ctx_put }).error(error);
    return res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_delete }).info("Incoming delete request", {
      body: req.body,
    });
    const diaryEntry =
      await DI.weightTrainingExerciseDiaryEntryRepository.findOne(
        req.params.id
      );
    if (!diaryEntry) {
      logger.child({ context: ctx_delete }).error("DiaryEntry does not exist");
      return res.status(404).send({ message: "DiaryEntry does not exist" });
    }

    const allExercises =
      await DI.weightTrainingExerciseDiaryEntryRepository.find(diaryEntry);
    await DI.weightTrainingExerciseDiaryEntryRepository.removeAndFlush(
      allExercises
    );

    await DI.weightTrainingExerciseDiaryEntryRepository.removeAndFlush(
      diaryEntry
    );
    logger.child({ context: ctx_delete }).info("DiaryEntry deleted", {
      diaryEntry: diaryEntry,
    });
    return res.status(204).send({});
  } catch (error: any) {
    logger.child({ context: ctx_delete }).error(error);
    return res.status(400).send(error.message);
  }
});

export const weightTrainingExerciseDiaryEntryController = router;
