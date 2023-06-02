import request from "supertest";
import { TestSeeder, testObjects } from "../src/seeders/TestSeeder";
import { DI, initializeServer } from "../src";
import { User } from "../src/entities";
import { getAuth } from "firebase-admin/auth";
import { FirebaseApp, initializeApp } from "@firebase/app";
import { firebaseConfigClient } from "../src/firebase.config";
import { createToken } from "./helper";

describe("UserController", () => {
  let app: FirebaseApp;

  beforeAll(async () => {
    await initializeServer();
    app = initializeApp(firebaseConfigClient);
    const seeder = DI.orm.getSeeder();
    DI.orm.config.set("dbName", "test-fitness-app");
    DI.orm.config.getLogger().setDebugMode(false);
    DI.orm.config.set("allowGlobalContext", true);
    await DI.orm.config.getDriver().reconnect();

    await seeder.seed(TestSeeder);
  });

  afterAll(async () => {
    await getAuth().deleteUser(testObjects.user2.firebaseUid);
    await getAuth().deleteUser(testObjects.user3.firebaseUid);
    await DI.orm.close(true);
    DI.server.close();
  });

  it("can send a user", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const response = await request(DI.server)
      .get(`/user`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(user._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.lastName).toEqual(user.lastName);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.birthday).toEqual(user.birthday);
    expect(response.body.exercisePlans).toBeDefined();
    expect(response.body.exercises).toBeDefined();
  });

  it("can update a user", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const updateData = {
      firstName: "Tobi",
      email: "update@mail.com",
    };
    const response = await request(DI.server)
      .put(`/user/updateInformation`)
      .set("Authorization", token)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(user._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.firstName).toEqual(updateData.firstName);
    expect(response.body.lastName).toEqual(user.lastName);
    expect(response.body.email).toEqual(updateData.email);
    expect(response.body.birthday).toEqual(user.birthday);
    expect(response.body.exercisePlans).toBeDefined();
    expect(response.body.exercises).toBeDefined();
  });

  it("can update the active plan", async () => {
    const user: User = testObjects.user3;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan = testObjects.weightTrainingExercisePlan3;
    const response = await request(DI.server)
      .put(`/user/updateActivePlan/${weightTrainingExercisePlan._id}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(user._id.toString());
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.firstName).toEqual(user.firstName);
    expect(response.body.lastName).toEqual(user.lastName);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.birthday).toEqual(user.birthday);
    expect(response.body.exercisePlans).toBeDefined();
    expect(response.body.exercises).toBeDefined();
    expect(response.body.activePlan.id).toEqual(weightTrainingExercisePlan._id.toString());
  });

  it("can delete a user", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const response = await request(DI.server)
      .delete(`/user`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});
