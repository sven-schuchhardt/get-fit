import request from "supertest";
import { TestSeeder, testObjects } from "../src/seeders/TestSeeder";
import { DI, initializeServer } from "../src";
import { BodyPart, User, WeightTrainingExercise } from "../src/entities";
import { createToken } from "./helper";
import { getAuth } from "firebase-admin/auth";
import { FirebaseApp, initializeApp } from "@firebase/app";
import { firebaseConfigClient } from "../src/firebase.config";

describe("WeightTrainingExerciseController", () => {
  let app: FirebaseApp;

  beforeAll(async () => {
    await initializeServer();
    app = initializeApp(firebaseConfigClient);
    const seeder = DI.orm.getSeeder();
    DI.orm.config.set("dbName", "test-fitness-app");
    DI.orm.config.getLogger().setDebugMode(false);
    DI.orm.config.set("allowGlobalContext", true);
    await DI.orm.config.getDriver().reconnect();
    await DI.orm.getSchemaGenerator().refreshDatabase();
    await seeder.seed(TestSeeder);
  });

  afterAll(async () => {
    await getAuth().deleteUser(testObjects.user1.firebaseUid);
    await getAuth().deleteUser(testObjects.user2.firebaseUid);
    await getAuth().deleteUser(testObjects.user3.firebaseUid);
    await DI.orm.close(true);
    DI.server.close();
  });

  it("can send one exercise", async () => {
    const token = await createToken(app);
    const exercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise1;
    const response = await request(DI.server)
      .get(`/weightTrainingExercise/one/${exercise._id}`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(exercise._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.users).toBeDefined();
    expect(response.body.description).toBe(exercise.description);
    expect(response.body.name).toBe(exercise.name);
    expect(response.body.muscleGroup).toBe(exercise.muscleGroup);
    expect(response.body.videoLink).toBe(exercise.videoLink);
    expect(response.body.equipment).toBe(exercise.equipment);
    expect(response.body.imageOrGifUrl).toBe(exercise.imageOrGifUrl);
    expect(response.body.createdByUser).toBeFalsy();
    expect(response.body.bodyPart.id).toBe(exercise.bodyPart._id.toString());
    expect(response.body.bodyPart.createdAt).toBeDefined();
    expect(response.body.bodyPart.updatedAt).toBeDefined();
    expect(response.body.bodyPart.bodyPart).toBe(exercise.bodyPart.bodyPart);
  });

  it("can't send one exercise because there is no matching id", async () => {
    const token = await createToken(app);
    const id = "ABCDEFGHIJKL";
    const response = await request(DI.server)
      .get(`/weightTrainingExercise/one/${id}`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("WeightTrainingExercise does not exist");
  });

  it("can send all exercises", async () => {
    const token = await createToken(app);
    const response = await request(DI.server)
      .get("/weightTrainingExercise/all/")
      .set("Authorization", token)
      .send();
    expect(response.status).toBe(200);
    for (let exercise of response.body) {
      expect(exercise.id).toBeDefined();
      expect(exercise.createdAt).toBeDefined();
      expect(exercise.updatedAt).toBeDefined();
      expect(exercise.users).toBeDefined();
      expect(exercise.description).toBeDefined();
      expect(exercise.name).toBeDefined();
      expect(exercise.muscleGroup).toBeDefined();
      expect(exercise.videoLink).toBeDefined();
      expect(exercise.equipment).toBeDefined();
      expect(exercise.imageOrGifUrl).toBeDefined();
      expect(exercise.createdByUser).toBeDefined();
      expect(exercise.bodyPart.id).toBeDefined();
      expect(exercise.bodyPart.createdAt).toBeDefined();
      expect(exercise.bodyPart.updatedAt).toBeDefined();
      expect(exercise.bodyPart.bodyPart).toBeDefined();
    }
  });

  it("can create a new exercise", async () => {
    const token = await createToken(app);
    const requireData = {
      description: " ",
      name: "test_exercise",
      bodyPart: "seeder test bodyPart1",
      muscleGroup: "pectorals",
      videoLink: "https://example.com/",
      equipment: "body weight",
      imageOrGifUrl: "https://example.com/",
    };

    const response = await request(DI.server)
      .post("/weightTrainingExercise/")
      .set("Authorization", token)
      .send(requireData);
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.users).toBeDefined();
    expect(response.body.description).toBe(requireData.description);
    expect(response.body.name).toBe(requireData.name);
    expect(response.body.muscleGroup).toBe(requireData.muscleGroup);
    expect(response.body.videoLink).toBe(requireData.videoLink);
    expect(response.body.equipment).toBe(requireData.equipment);
    expect(response.body.imageOrGifUrl).toBe(requireData.imageOrGifUrl);
    expect(response.body.createdByUser).toBeTruthy();
    expect(response.body.bodyPart.id).toBeDefined();
    expect(response.body.bodyPart.createdAt).toBeDefined();
    expect(response.body.bodyPart.updatedAt).toBeDefined();
    expect(response.body.bodyPart.bodyPart).toBe(requireData.bodyPart);
  });

  it("can't create a new exercise because there is no matching body part.", async () => {
    const token = await createToken(app);
    const requireData = {
      description: " ",
      name: "test_exercise",
      bodyPart: "no body part",
      muscleGroup: "pectorals",
      videoLink: "https://example.com/",
      equipment: "body weight",
      imageOrGifUrl: "https://example.com/",
    };

    const response = await request(DI.server)
      .post("/weightTrainingExercise/")
      .set("Authorization", token)
      .send(requireData);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("BodyPart not found");
  });

  it("can't create a new exercise because not all necessary data are available", async () => {
    const token = await createToken(app);
    const requireData = {
      description: " ",
      bodyPart: "seeder test bodyPart1",
      muscleGroup: "pectorals",
      videoLink: "https://example.com/",
      equipment: "body weight",
      imageOrGifUrl: "https://example.com/",
    };

    const response = await request(DI.server)
      .post("/weightTrainingExercise/")
      .set("Authorization", token)
      .send(requireData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can update an exercise", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const exercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise3;
    const requireData = {
      name: "test_update_exercise",
      equipment: "body weight",
    };

    const response = await request(DI.server)
      .put(`/weightTrainingExercise/updateExercise/${exercise._id}`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(exercise._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.users).toBeDefined();
    expect(response.body.description).toBe(exercise.description);
    expect(response.body.name).toBe(requireData.name);
    expect(response.body.muscleGroup).toBe(exercise.muscleGroup);
    expect(response.body.videoLink).toBe(exercise.videoLink);
    expect(response.body.equipment).toBe(requireData.equipment);
    expect(response.body.imageOrGifUrl).toBe(exercise.imageOrGifUrl);
    expect(response.body.createdByUser).toBeTruthy();
    expect(response.body.bodyPart.id).toEqual(exercise.bodyPart._id.toString());
    expect(response.body.bodyPart.createdAt).toBeDefined();
    expect(response.body.bodyPart.updatedAt).toBeDefined();
    expect(response.body.bodyPart.bodyPart).toBe(exercise.bodyPart.bodyPart);
  });

  it("can't update an exercise because there is no matching exercise.", async () => {
    const user: User = testObjects.user2;
    const token = await createToken(app, user);
    const id = "1234567890AB";
    const requireData = {
      name: "test_update_exercise",
      equipment: "body weight",
    };

    const response = await request(DI.server)
      .put(`/weightTrainingExercise/updateExercise/${id}`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("WeightTrainingExercise does not exist");
  });

  it("can update an exercise body part", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const exercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise3;
    const bodyPart: BodyPart = testObjects.bodyPart2;
    const requireData = {
      bodyPart: bodyPart._id,
    };

    const response = await request(DI.server)
      .put(`/weightTrainingExercise/updateBodyPart/${exercise._id}`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(exercise._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.users).toBeDefined();
    expect(response.body.description).toBe(exercise.description);
    expect(response.body.name).toBe("test_update_exercise");
    expect(response.body.muscleGroup).toBe(exercise.muscleGroup);
    expect(response.body.videoLink).toBe(exercise.videoLink);
    expect(response.body.equipment).toBe(exercise.equipment);
    expect(response.body.imageOrGifUrl).toBe(exercise.imageOrGifUrl);
    expect(response.body.createdByUser).toBeTruthy();
    expect(response.body.bodyPart.id).toEqual(requireData.bodyPart.toString());
    expect(response.body.bodyPart.createdAt).toBeDefined();
    expect(response.body.bodyPart.updatedAt).toBeDefined();
    expect(response.body.bodyPart.bodyPart).toBe(bodyPart.bodyPart);
  });

  it("can't update an exercise because there is no matching body part.", async () => {
    const token = await createToken(app);
    const id = testObjects.weightTrainingExercise1._id;
    const requireData = {
      bodyPart: "no body part",
    };

    const response = await request(DI.server)
      .put(`/weightTrainingExercise/updateBodyPart/${id}`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("BodyPart does not exist");
  });

  it("can't update an exercise because there request body is empty.", async () => {
    const token = await createToken(app);
    const exercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise1;
    const requireData = {};

    const response = await request(DI.server)
      .put(`/weightTrainingExercise/updateBodyPart/${exercise._id}`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can delete an exercise", async () => {
    const token = await createToken(app);
    const exercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise1;

    const response = await request(DI.server)
      .delete(`/weightTrainingExercise/${exercise._id}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("can't delete an exercise because there is no matching exercise.", async () => {
    const token = await createToken(app);
    const id = "no id";

    const response = await request(DI.server)
      .delete(`/weightTrainingExercise/${id}`)
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("WeightTrainingExercise does not exist");
  });
});
