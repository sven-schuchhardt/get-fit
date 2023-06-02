import request from "supertest";
import { TestSeeder, testObjects } from "../src/seeders/TestSeeder";
import { DI, initializeServer } from "../src";
import {
  User,
  WeightTrainingExercise,
  WeightTrainingExercisePlan,
} from "../src/entities";
import { createToken, deleteUserByEmail } from "./helper";
import { FirebaseApp, initializeApp } from "@firebase/app";
import { firebaseConfigClient } from "../src/firebase.config";

describe("WeightTrainingExercisePlanController", () => {
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
    await deleteUserByEmail("user1@example.com");
    await deleteUserByEmail("user2@example.com");
    await deleteUserByEmail("user3@example.com");
    await DI.orm.close(true);
    DI.server.close();
  });

  it("can send an exercise plan", async () => {
    const token = await createToken(app);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan1;
    const response = await request(DI.server)
      .get(`/weightTrainingExercisePlan/one/${weightTrainingExercisePlan._id}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(weightTrainingExercisePlan._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.title).toEqual(weightTrainingExercisePlan.title);
    expect(response.body.exercises).toBeDefined();
    expect(response.body.users).toBeDefined();
    expect(response.body.createdByUser).toEqual(
      weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.description).toEqual(
      weightTrainingExercisePlan.description
    );
    expect(response.body.diaryEntries).toBeDefined();
  });

  it("can't send an exercise plan because it does not exist", async () => {
    const token = await createToken(app);
    const response = await request(DI.server)
      .get(`/weightTrainingExercisePlan/one/1234567890AB`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercisePlan does not exist"
    );
  });

  it("can send all exercise plan by user id", async () => {
    const token = await createToken(app);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan1;
    const user: User = testObjects.user1;

    const response = await request(DI.server)
      .get(`/weightTrainingExercisePlan/allByUser`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("can send all exercise plans that has been created by a user", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);

    const response = await request(DI.server)
      .get(`/weightTrainingExercisePlan/allCreatedByUser`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("can send all default exercise plans", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);

    const response = await request(DI.server)
      .get(`/weightTrainingExercisePlan/allDefaultByUser`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("can create an exercise plan", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const requireData = {
      description: "test_description",
      title: "test_exercise",
      user: user._id,
    };

    const response = await request(DI.server)
      .post(`/weightTrainingExercisePlan`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.title).toEqual(requireData.title);
    expect(response.body.exercises).toBeDefined();
    expect(response.body.users).toBeDefined();
    expect(response.body.createdByUser).toEqual(true);
    expect(response.body.description).toContain(requireData.description);
    expect(response.body.diaryEntries).toBeDefined();
  });

  it("can't create an exercise plan because of missing data", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const requireData = {
      user: user._id,
      description: "test_description",
    };

    const response = await request(DI.server)
      .post(`/weightTrainingExercisePlan`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can add an exercise to exercise plan", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan3;
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise5;
    const requireData = {
      weightTrainingExercise: weightTrainingExercise._id,
      setAmount: 1,
      repetition: 1,
      days: ["Mon", "Fri"],
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExercisePlan/addExercise/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(weightTrainingExercisePlan._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.title).toEqual(weightTrainingExercisePlan.title);
    expect(response.body.exercises).toBeDefined();
    expect(response.body.createdByUser).toEqual(
      weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.description).toContain(
      weightTrainingExercisePlan.description
    );
    expect(response.body.diaryEntries).toBeDefined();
  });

  it("can't add an exercise to the exercise plan because of missing data", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan3;
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise3;
    const requireData = {
      setAmount: 3,
      days: ["DI"],
      weightTrainingExercise: weightTrainingExercise._id,
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExercisePlan/addExercise/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can't add an exercise to the exercise plan because exercise plan does not exist", async () => {
    const token = await createToken(app);
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise1;
    const requireData = {
      weightTrainingExercise: weightTrainingExercise._id,
      setAmount: 1,
      repetition: 1,
      days: ["Mo"],
    };

    const response = await request(DI.server)
      .put(`/weightTrainingExercisePlan/addExercise/1234567890AB`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercisePlan does not exist"
    );
  });

  it("can't add an exercise to the exercise plan because exercise does not exist", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan3;
    const requireData = {
      weightTrainingExercise: "1234567890AB",
      setAmount: 1,
      repetition: 1,
      day: "Mo",
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExercisePlan/addExercise/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercise does not exist"
    );
  });

  it("can update an exercise from the exercise plan", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan3;
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise4;
    const requireData = {
      weightTrainingExercise: weightTrainingExercise._id,
      days: ["Mon", "Fri", "Sat"],
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExercisePlan/updateExercise/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(weightTrainingExercisePlan._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.title).toEqual(weightTrainingExercisePlan.title);
    expect(response.body.exercises).toBeDefined();
    expect(response.body.createdByUser).toEqual(
      weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.description).toContain(
      weightTrainingExercisePlan.description
    );
    expect(response.body.diaryEntries).toBeDefined();
  });

  it("can't update an exercise from the exercise plan because exercise plan does not exist", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const requireData = {
      setAmount: 1,
      repetition: 1,
      days: ["Mo"],
    };

    const response = await request(DI.server)
      .put(`/weightTrainingExercisePlan/updateExercise/1234567890AB`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercisePlan does not exist"
    );
  });

  it("can't update an exercise from the exercise plan because exercise does not exist", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan3;
    const requireData = {
      weightTrainingExercise: "1234567890AB",
      setAmount: 1,
      repetition: 1,
      days: ["Mo"],
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExercisePlan/updateExercise/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercise does not exist"
    );
  });

  it("can remove an exercise from the exercise plan", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan3;
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise3;
    const requireData = {
      weightTrainingExercise: weightTrainingExercise._id,
      setAmount: 1,
      repetition: 1,
      days: ["Mo"],
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExercisePlan/removeExercise/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(weightTrainingExercisePlan._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.title).toEqual(weightTrainingExercisePlan.title);
    expect(response.body.exercises).toBeDefined();
    expect(response.body.createdByUser).toEqual(
      weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.description).toContain(
      weightTrainingExercisePlan.description
    );
    expect(response.body.diaryEntries).toBeDefined();
  });

  it("can't remove an exercise from the exercise plan because exercise plan does not exist", async () => {
    const token = await createToken(app);
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise1;
    const requireData = {
      weightTrainingExercise: weightTrainingExercise._id,
      setAmount: 1,
      repetition: 1,
      days: ["Mo"],
    };

    const response = await request(DI.server)
      .put(`/weightTrainingExercisePlan/removeExercise/1234567890AB`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercisePlan does not exist"
    );
  });

  it("can't remove an exercise from the exercise plan because exercise does not exist", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan3;
    const requireData = {
      weightTrainingExercise: "1234567890",
      setAmount: 1,
      repetition: 1,
      days: ["Mo"],
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExercisePlan/removeExercise/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercise does not exist"
    );
  });

  it("can delete a exercise plan that has been created by a user", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan3;
    const response = await request(DI.server)
      .delete(
        `/weightTrainingExercisePlan/${weightTrainingExercisePlan._id.toString()}`
      )
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("can't delete a default exercise plan", async () => {
    const token = await createToken(app);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan2;
    const response = await request(DI.server)
      .delete(
        `/weightTrainingExercisePlan/${weightTrainingExercisePlan._id.toString()}`
      )
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercisePlan does not exist"
    );
  });

  it("can't delete an exercise plan because exercise plan does not exist", async () => {
    const token = await createToken(app);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan1;

    const response = await request(DI.server)
      .delete("/weightTrainingExercisePlan/1234567890AB")
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "WeightTrainingExercisePlan does not exist"
    );
  });
});
