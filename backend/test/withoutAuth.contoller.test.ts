import request from "supertest";
import { TestSeeder, testObjects } from "../src/seeders/TestSeeder";
import { DI, initializeServer } from "../src";
import { getAuth } from "firebase-admin/auth";
import { FirebaseApp, initializeApp } from "@firebase/app";
import { firebaseConfigClient } from "../src/firebase.config";

describe("WithoutAuthController", () => {
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

  it("can send all weightTrainingExercises", async () => {
    const response = await request(DI.server).get(
      "/withoutAuth/weightTrainingExercises/allDefault"
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
  });

  it("should get all  yogaExercises", async () => {
    const response = await request(DI.server).get(
      "/withoutAuth/yogaExercises/allDefault"
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
