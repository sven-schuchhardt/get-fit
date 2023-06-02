import request from "supertest";
import { DI, initializeServer } from "../src";
import { BodyPart } from "../src/entities";
import { testObjects, TestSeeder } from "../src/seeders/TestSeeder";
import { createToken, deleteUserByEmail } from "./helper";
import { FirebaseApp, initializeApp } from "@firebase/app";
import { firebaseConfigClient } from "../src/firebase.config";

describe("BodyPartController", () => {
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

  it("can send multi body parts", async () => {
    const token = await createToken(app);
    const bodyPart: BodyPart = testObjects.bodyPart1;
    const bodyPart2: BodyPart = testObjects.bodyPart2;
    const response = await request(DI.server)
      .get(`/bodyPart/multi/`)
      .set("Authorization", token)
      .send({
        names: [bodyPart.bodyPart, bodyPart2.bodyPart],
      });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    for (const b of response.body) {
      expect(b.id).toBeDefined();
      expect(b.createdAt).toBeDefined();
      expect(b.updatedAt).toBeDefined();
      expect(b.bodyPart).toBeDefined();
      expect(b.exercises).toBeDefined();
    }
  });

  it("can't send multi body parts because there is no matching id", async () => {
    const token = await createToken(app);
    const bodyPart: BodyPart = testObjects.bodyPart1;
    const noBodyPart = "noBodyPart";
    const response = await request(DI.server)
      .get("/bodyPart/multi/")
      .set("Authorization", token)
      .send({
        names: [bodyPart.bodyPart, noBodyPart],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`BodyPart ${noBodyPart} does not exist`);
  });

  it("can send all body parts", async () => {
    const token = await createToken(app);
    const response = await request(DI.server)
      .get("/bodyPart/all")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    for (const bodyPart of response.body) {
      expect(bodyPart.id).toBeDefined();
      expect(bodyPart.createdAt).toBeDefined();
      expect(bodyPart.updatedAt).toBeDefined();
      expect(bodyPart.bodyPart).toBeDefined();
    }
  });

  it("can create a body part", async () => {
    const token = await createToken(app);
    const requireData = {
      bodyPart: "test",
    };
    const response = await request(DI.server)
      .post("/bodyPart")
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.bodyPart).toBe(requireData.bodyPart);
  });

  it("can't create a body part because of missing data", async () => {
    const token = await createToken(app);
    const requireData = {};
    const response = await request(DI.server)
      .post("/bodyPart")
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can update a body part", async () => {
    const token = await createToken(app);
    const bodyPart: BodyPart = testObjects.bodyPart2;
    const requireData = {
      bodyPart: "test",
    };
    const response = await request(DI.server)
      .put(`/bodyPart/${bodyPart._id}`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.bodyPart).toBe(requireData.bodyPart);
  });

  it("can't update a body part because of missing data", async () => {
    const token = await createToken(app);
    const bodyPart: BodyPart = testObjects.bodyPart2;
    const requireData = {};
    const response = await request(DI.server)
      .put(`/bodyPart/${bodyPart._id}`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can't update a body part because there is no matching id", async () => {
    const token = await createToken(app);
    const requireData = {
      bodyPart: "test",
    };
    const response = await request(DI.server)
      .put("/bodyPart/123")
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("BodyPart does not exist");
  });

  it("can delete a body part", async () => {
    const token = await createToken(app);
    const bodyPart: BodyPart = testObjects.bodyPart3;
    const response = await request(DI.server)
      .delete(`/bodyPart/${bodyPart._id}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("can't delete a body part because there is no matching id", async () => {
    const token = await createToken(app);
    const response = await request(DI.server)
      .delete("/bodyPart/123")
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("BodyPart does not exist");
  });
});
