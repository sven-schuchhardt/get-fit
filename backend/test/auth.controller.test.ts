import request from "supertest";
import { TestSeeder, testObjects } from "../src/seeders/TestSeeder";
import { DI, initializeServer } from "../src";
import { getAuth } from "firebase-admin/auth";
import { createFirebaseUser } from "./helper";

describe("AuthController", () => {
  beforeAll(async () => {
    await initializeServer();
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
    const userRecord = await getAuth().getUserByEmail("test@gmail.com");
    await getAuth().deleteUser(userRecord.uid);
    await DI.orm.close(true);
    DI.server.close();
  });

  it("can create a user", async () => {
    const email = "test@gmail.com";
    const uid = await createFirebaseUser(email);
    const requireData = {
      firebaseUid: uid,
      firstName: "Alex",
      lastName: "Mustermann",
      email: email,
      birthday: "1990-01-01",
    };
    const response = await request(DI.server)
      .post("/auth/register")
      .send(requireData);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.lastName).toEqual(requireData.lastName);
    expect(response.body.email).toEqual(requireData.email);
    expect(response.body.birthday).toEqual(requireData.birthday);
    expect(response.body.exercisePlans).toBeDefined();
    expect(response.body.exercises).toBeDefined();
  });

  it("can't create a user because of missing data", async () => {
    const requireData = {
      lastName: "Mustermann",
      email: "test@gmail.com",
      birthday: "1990-01-01",
    };

    const response = await request(DI.server)
      .post("/auth/register")
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});
