import { Router } from "express";
import {
  WeightTrainingExerciseDTO,
  WeightTrainingExercise,
  WeightTrainingExerciseSchemaPost,
  WeightTrainingExerciseSchemaUpdate,
  BodyPartSchema,
  User,
} from "../entities";
import { DI } from "../";
import { wrap } from "@mikro-orm/core";
import { ObjectID } from "bson";
import { logger } from "../utils";

const ctx_get = {
  controller: "WeightTrainingExercise",
  request: "get",
  databaseCollection: "WeightTrainingExercise",
};

const ctx_post = {
  controller: "WeightTrainingExercise",
  request: "post",
  databaseCollection: "WeightTrainingExercise",
};

const ctx_put = {
  controller: "WeightTrainingExercise",
  request: "put",
  databaseCollection: "WeightTrainingExercise",
};

const ctx_delete = {
  controller: "WeightTrainingExercise",
  request: "delete",
  databaseCollection: "WeightTrainingExercise",
};

const router = Router({ mergeParams: true });

router.get("/one/:id", async (req, res) => {
  logger
    .child({
      context: ctx_get,
    })
    .info("Incoming get request", { id: req.params.id });
  const user: User = req.user;
  const weightTrainingExercise =
    await DI.weightTrainingExerciseRepository.findOne({
      _id: new ObjectID(req.params.id),
      users: user,
    });
  if (!weightTrainingExercise) {
    logger
      .child({
        context: ctx_get,
      })
      .info("WeightTrainingExercise does not exist", { id: req.params.id });
    return res
      .status(404)
      .send({ message: "WeightTrainingExercise does not exist" });
  }
  logger
    .child({
      context: ctx_get,
    })
    .info("send WeightTrainingExercise", { id: req.params.id });
  await DI.weightTrainingExerciseRepository.populate(weightTrainingExercise, [
    "bodyPart",
  ]);
  res.status(200).send(weightTrainingExercise);
});

router.get("/all", async (req, res) => {
  const user: User = req.user;
  const weightTrainingExercises =
    await DI.weightTrainingExerciseRepository.find({
      users: user,
    });
  logger
    .child({
      context: ctx_get,
    })
    .info("Send all WeightTrainingExercises");
  await DI.weightTrainingExerciseRepository.populate(weightTrainingExercises, [
    "bodyPart",
  ]);
  res.status(200).send(weightTrainingExercises);
});

router.post("/", async (req, res) => {
  const { body } = req;
  try {
    logger
      .child({
        context: ctx_post,
      })
      .info("Incoming body data for the post request", { body: body });
    const user = req.user;
    const bodyPart = await DI.bodyPartRepository.findOne({
      bodyPart: body.bodyPart,
    });
    if (!bodyPart) {
      return res.status(404).send({ message: "BodyPart not found" });
    }

    const validatedExerciseData =
      await WeightTrainingExerciseSchemaPost.validate(body);
    const createWeightTrainingExerciseDTO: WeightTrainingExerciseDTO = {
      ...validatedExerciseData,
      createdByUser: true,
      bodyPart: bodyPart,
    };
    const weightTrainingExercise = new WeightTrainingExercise(
      createWeightTrainingExerciseDTO
    );
    bodyPart.exercises.add(weightTrainingExercise);
    DI.bodyPartRepository.persist(bodyPart);
    wrap(weightTrainingExercise).assign({users: [user]});
    await DI.weightTrainingExerciseRepository.persistAndFlush(
      weightTrainingExercise
    );
    return res.status(201).send(weightTrainingExercise);
  } catch (error: any) {
    logger
      .child({
        context: ctx_post,
      })
      .error(`${error.message}`, { body: body });
    return res.status(400).json({ message: error.message });
  }
});

router.put("/updateBodyPart/:id", async (req, res) => {
  const { body } = req;
  try {
    logger
      .child({
        context: ctx_put,
      })
      .info("Incoming body data for the put request", {
        id: req.params.id,
        body: body,
      });
    const user = req.user;
    const weightTrainingExercise =
      await DI.weightTrainingExerciseRepository.findOne({
        _id: new ObjectID(req.params.id),
        users: user,
      });
    if (!weightTrainingExercise) {
      logger
        .child({
          context: ctx_put,
        })
        .info("WeightTrainingExercise does not exist", {
          id: req.params.id,
        });
      return res
        .status(404)
        .send({ message: "WeightTrainingExercise does not exist" });
    }

    const validatedBodyPartData = (await BodyPartSchema.validate(body))
      .bodyPart;

    const bodyPart = await DI.bodyPartRepository.findOne(validatedBodyPartData);
    if (!bodyPart) {
      logger
        .child({
          context: ctx_put,
        })
        .info("BodyPart does not exist", {
          id: req.params.id,
        });
      return res.status(404).send({ message: "BodyPart does not exist" });
    }

    wrap(weightTrainingExercise).assign({ bodyPart: bodyPart });
    await DI.weightTrainingExerciseRepository.flush();
    await DI.weightTrainingExerciseRepository.populate(weightTrainingExercise, [
      "bodyPart",
    ]);
    return res.json(weightTrainingExercise);
  } catch (error: any) {
    logger
      .child({
        context: ctx_put,
      })
      .error(`${error.message}`, { id: req.params.id, body: body });
    return res.status(400).json({ message: error.message });
  }
});

router.put("/updateExercise/:id", async (req, res) => {
  const { body } = req;
  try {
    logger
      .child({
        context: ctx_put,
      })
      .info("Incoming body data for the put request", {
        id: req.params.id,
        body: body,
      });
    const user = req.user;
    const weightTrainingExercise =
      await DI.weightTrainingExerciseRepository.findOne({
        _id: new ObjectID(req.params.id),
        users: user,
        createdByUser: true,
      });
    if (!weightTrainingExercise) {
      logger
        .child({
          context: ctx_put,
        })
        .info("WeightTrainingExercise does not exist", {
          id: req.params.id,
        });
      return res
        .status(404)
        .send({ message: "WeightTrainingExercise does not exist" });
    }

    const validatedExerciseData =
      await WeightTrainingExerciseSchemaUpdate.validate(body);
    wrap(weightTrainingExercise).assign({ ...validatedExerciseData });
    await DI.weightTrainingExerciseRepository.flush();
    await DI.weightTrainingExerciseRepository.populate(weightTrainingExercise, [
      "bodyPart",
    ]);
    return res.json(weightTrainingExercise);
  } catch (error: any) {
    logger
      .child({
        context: ctx_put,
      })
      .error(`${error.message}`, { id: req.params.id, body: body });
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    logger
      .child({
        context: ctx_delete,
      })
      .info("Incoming delete request", {
        id: req.params.id,
      });

    const weightTrainingExercise =
      await DI.weightTrainingExerciseRepository.findOne(req.params.id);
    if (!weightTrainingExercise) {
      logger
        .child({
          context: ctx_delete,
        })
        .info("WeightTrainingExercise does not exist", {
          id: req.params.id,
        });
      return res
        .status(404)
        .send({ message: "WeightTrainingExercise does not exist" });
    }
    await DI.weightTrainingExerciseRepository.removeAndFlush(
      weightTrainingExercise
    );

    logger
      .child({ context: ctx_delete })
      .info("WeightTrainingExercise was deleted", { id: req.params.id });
    return res.status(204).send({});
  } catch (error: any) {
    logger
      .child({
        context: ctx_delete,
      })
      .error(`${error.message}`, { id: req.params.id });
    return res.status(400).json({ message: error.message });
  }
});

export const WeightTrainingExerciseController = router;
