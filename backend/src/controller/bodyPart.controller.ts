import { wrap } from "@mikro-orm/core";
import { Router } from "express";
import { DI } from "..";
import { BodyPart, BodyPartDTO, BodyPartSchema } from "../entities";
import { logger } from "../utils";

const ctx_get = {
  controller: "BodyPart",
  request: "get",
  databaseCollection: "BodyPart",
};

const ctx_post = {
  controller: "BodyPart",
  request: "post",
  databaseCollection: "BodyPart",
};

const ctx_put = {
  controller: "BodyPart",
  request: "put",
  databaseCollection: "BodyPart",
};

const router = Router({ mergeParams: true });

router.get("/multi/", async (req, res) => {
  const bodyParts: BodyPart[] = [];
  const names: string[] = req.body.names;

  logger.child({ context: ctx_get }).info("Incoming get request", {
    names: names,
  });
  for (const name of names) {
    const bodyPart = await DI.bodyPartRepository.findOne({ bodyPart: name });
    if (!bodyPart) {
      logger
        .child({ context: ctx_get })
        .info(`BodyPart ${name} does not exist`, {
          ids: names,
        });
      return res
        .status(404)
        .send({ message: `BodyPart ${name} does not exist` });
    }
    bodyParts.push(bodyPart);
  }

  logger.child({ context: ctx_get }).info("send BodyPart", {
    names: names,
  });
  await DI.bodyPartRepository.populate(bodyParts, ["exercises"]);
  res.status(200).send(bodyParts);
});

router.get("/all", async (req, res) => {
  logger.child({ context: ctx_get }).info("Incoming get all bodyParts request");

  const bodyParts = await DI.bodyPartRepository.findAll();

  logger.child({ context: ctx_get }).info("send BodyParts");
  res.status(200).send(bodyParts);
});

router.post("/", async (req, res) => {
  try {
    logger.child({ context: ctx_post }).info("Incoming post request", {
      body: req.body,
    });

    const validatedBodyPartData = await BodyPartSchema.validate(req.body);
    const createBodyPartDTO: BodyPartDTO = {
      ...validatedBodyPartData,
    };
    const bodyPart = new BodyPart(createBodyPartDTO);
    await DI.bodyPartRepository.persistAndFlush(bodyPart);
    await DI.bodyPartRepository.populate(bodyPart, ["exercises"]);
    return res.status(201).send(bodyPart);
  } catch (error: any) {
    logger
      .child({ context: ctx_post })
      .error(`${error.message}`, { body: req.body });
    return res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    logger
      .child({ context: ctx_put })
      .info("Incoming body data for the put request", {
        id: req.params.id,
        body: req.body,
      });

    const bodyPart = await DI.bodyPartRepository.findOne(req.params.id);
    if (!bodyPart) {
      logger.child({ context: ctx_put }).info("BodyPart does not exist", {
        id: req.params.id,
      });
      return res.status(404).send({ message: "BodyPart does not exist" });
    }

    const validatedBodyPartData = await BodyPartSchema.validate(req.body);

    wrap(bodyPart).assign({ ...validatedBodyPartData });
    await DI.bodyPartRepository.flush();
    await DI.bodyPartRepository.populate(bodyPart, ["exercises"]);
    return res.status(200).send(bodyPart);
  } catch (error: any) {
    logger
      .child({
        context: ctx_put,
      })
      .error(`${error.message}`, { body: req.body });
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    logger.child({ context: ctx_put }).info("Incoming delete request", {
      id: req.params.id,
    });

    const bodyPart = await DI.bodyPartRepository.findOne(req.params.id);
    if (!bodyPart) {
      logger.child({ context: ctx_put }).info("BodyPart does not exist", {
        id: req.params.id,
      });
      return res.status(404).send({ message: "BodyPart does not exist" });
    }

    await DI.bodyPartRepository.removeAndFlush(bodyPart);
    return res.status(204).send({});
  } catch (error: any) {
    logger
      .child({
        context: ctx_put,
      })
      .error(`${error.message}`, { body: req.body });
    return res.status(400).json({ message: error.message });
  }
});

export const BodyPartController = router;
