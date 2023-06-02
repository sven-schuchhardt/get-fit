import { Router } from "express";
import { User, UserSchemaUpdate } from "../entities";
import { DI } from "..";
import { wrap } from "@mikro-orm/core";
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "@mikro-orm/mongodb";
import { logger } from "../utils";

const router = Router({ mergeParams: true });

export const UserController = router;

const ctx_get = {
  controller: "User",
  request: "get",
  databaseCollection: "User",
};

const ctx_put = {
  controller: "User",
  request: "put",
  databaseCollection: "User",
};

const ctx_delete = {
  controller: "User",
  request: "delete",
  databaseCollection: "User",
};

router.get("/", async (req, res) => {
  logger.child({ context: ctx_get }).info("Incoming get request", {
    id: req.user._id,
  });
  const user: User = req.user;
  await DI.userRepository.populate(user, [
    "exercisePlans",
    "exercises",
    "activePlan",
  ]);
  res.status(200).send(user);
});

router.put("/updateInformation", async (req, res) => {
  try {
    logger.child({ context: ctx_put }).info("Incoming put request", {
      body: req.body,
    });

    const user: User = req.user;
    const validateUserData = await UserSchemaUpdate.validate({
      ...req.body,
    });

    wrap(user).assign({ ...validateUserData });
    await DI.userRepository.flush();
    await DI.userRepository.populate(user, [
      "exercisePlans",
      "exercises",
      "activePlan",
    ]);
    return res.status(200).send(user);
  } catch (error: any) {
    logger.child({ context: ctx_put }).error("Error", { error: error.message });
    return res.status(400).send({ message: error.message });
  }
});

router.put("/updateActivePlan/:id", async (req, res) => {
  try {
    logger
      .child({ context: ctx_put })
      .info("Incoming put request for updateActivePlan", {
        body: req.body,
      });
    const user: User = req.user;

    let activePlan: any = await DI.weightTrainingExercisePlanRepository.findOne(
      {
        _id: new ObjectId(req.params.id),
        users: user,
      }
    );
    activePlan = activePlan
      ? activePlan
      : await DI.yogaExercisePlanRepository.findOne(req.params.id);
    if (!activePlan) {
      logger.child({ context: ctx_put }).error("Error", {
        error: "Plan not found",
      });
      return res.status(404).send({ message: "Plan not found" });
    }
    wrap(user).assign({ activePlan: activePlan });
    await DI.userRepository.flush();
    await DI.userRepository.populate(user, [
      "exercisePlans",
      "exercises",
      "activePlan",
    ]);
    logger.child({ context: ctx_put }).info("Updated active plan", {
      user: user,
    });
    return res.status(200).send(user);
  } catch (error: any) {
    logger.child({ context: ctx_put }).error("Error", { error: error.message });
    return res.status(400).send({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    logger.child({ context: ctx_delete }).info("Incoming delete request", {
      id: req.user._id,
    });

    const user: User = req.user;
    DI.userRepository.remove(user);
    await getAuth().deleteUser(req.user.firebaseUid);
    await DI.userRepository.flush();
    return res.status(204).send({});
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
});
