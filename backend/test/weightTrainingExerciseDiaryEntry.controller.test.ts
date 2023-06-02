import request from "supertest";
import { DI, initializeServer } from "../src";
import {
  User,
  WeightTrainingExercise,
  WeightTrainingExerciseDiaryEntry,
  WeightTrainingExercisePlan,
} from "../src/entities";
import { TestSeeder, testObjects } from "../src/seeders/TestSeeder";
import { createToken, deleteUserByEmail } from "./helper";
import { FirebaseApp, initializeApp } from "@firebase/app";
import { firebaseConfigClient } from "../src/firebase.config";

describe("WeightTrainingExerciseDiaryEntry", () => {
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

  it("can get summarized data for the last seven days", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry1;

    const response = await request(DI.server)
      .get(`/weightTrainingExerciseDiaryEntry/getSummarizedDataLastSevenDays`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0].amount).toBe(300);
    expect(response.body[0].repetition).toBe(20);
    expect(response.body[0].diaryEntry.id).toEqual(diaryEntry._id.toString());
    expect(response.body[0].diaryEntry.date).toBe(
      diaryEntry.date.toISOString()
    );
  });

  it("can get a diary entry for a weight training exercise plan", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan1;
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry1;

    const date: string = diaryEntry.date.toISOString().split("T")[0];
    const day = diaryEntry.date.toDateString().split(" ")[2];
    const data = date.split("-");
    const requireData = {
      date: `${data[0]}-${data[1]}-${day}`,
    };

    const response = await request(DI.server)
      .get(
        `/weightTrainingExerciseDiaryEntry/byDatePlanUser/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.date).toBe(`${date}T00:00:00.000Z`);

    expect(response.body.weightTrainingExercisePlan.id).toEqual(
      weightTrainingExercisePlan._id.toString()
    );
    expect(response.body.weightTrainingExercisePlan.title).toBe(
      weightTrainingExercisePlan.title
    );
    expect(response.body.weightTrainingExercisePlan.description).toBe(
      weightTrainingExercisePlan.description
    );
    expect(response.body.weightTrainingExercisePlan.users.length).toBe(
      weightTrainingExercisePlan.users.length
    );
    expect(response.body.weightTrainingExercisePlan.createdByUser).toBe(
      weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.weightTrainingExercisePlan.createdAt).toBe(
      weightTrainingExercisePlan.createdAt.toISOString()
    );
    expect(response.body.weightTrainingExercisePlan.updatedAt).toBe(
      weightTrainingExercisePlan.updatedAt.toISOString()
    );
  });

  it("can't get a diary entry for a weight training exercise plan", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan1;
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry1;

    const date: string = diaryEntry.date.toISOString().split("T")[0];
    const day = diaryEntry.date.toDateString().split(" ")[2];
    const data = date.split("-");
    const requireData = {
      date: date,
    };

    const response = await request(DI.server)
      .get(`/weightTrainingExerciseDiaryEntry/byDatePlanUser/1234567890`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
  });

  it("can't get a diary entry because weight training plan doesn't exist", async () => {
    const user: User = testObjects.user1;
    const token = await createToken(app, user);
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry1;

    const requireData = {
      date: diaryEntry.date.toISOString().split("T")[0],
    };

    const response = await request(DI.server)
      .get(`/weightTrainingExerciseDiaryEntry/byDatePlanUser/1234567890AB`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "WeightTrainingExercisePlan does not exist"
    );
  });

  it("can't get a diary entry because date is missing", async () => {
    const token = await createToken(app);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan1;
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry1;

    const requireData = {};

    const response = await request(DI.server)
      .get(
        `/weightTrainingExerciseDiaryEntry/byDatePlanUser/${weightTrainingExercisePlan._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can create a diary entry for a weight training exercise plan", async () => {
    const token = await createToken(app);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan2;
    const requireData = {
      date: "2019-01-16",
      weightTrainingExercisePlan: weightTrainingExercisePlan._id,
      note: "test_diary_entry",
    };
    const response = await request(DI.server)
      .post("/weightTrainingExerciseDiaryEntry")
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(201);
    expect(response.body.date).toBe(`${requireData.date}T00:00:00.000Z`);
    expect(response.body.note).toBe(requireData.note);

    expect(response.body.weightTrainingExercisePlan.id).toEqual(
      weightTrainingExercisePlan._id.toString()
    );
    expect(response.body.weightTrainingExercisePlan.title).toBe(
      weightTrainingExercisePlan.title
    );
    expect(response.body.weightTrainingExercisePlan.description).toBe(
      weightTrainingExercisePlan.description
    );
    expect(response.body.weightTrainingExercisePlan.users.length).toBe(
      weightTrainingExercisePlan.users.length
    );
    expect(response.body.weightTrainingExercisePlan.createdByUser).toBe(
      weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.weightTrainingExercisePlan.createdAt).toBe(
      weightTrainingExercisePlan.createdAt.toISOString()
    );
    expect(response.body.weightTrainingExercisePlan.updatedAt).toBe(
      weightTrainingExercisePlan.updatedAt.toISOString()
    );
  });

  it("can't create a diary entry for a weight training exercise plan because plan doesn't exist", async () => {
    const token = await createToken(app);
    const requireData = {
      date: "2019-01-16",
      weightTrainingExercisePlan: "1234567890AB",
      note: "test_diary_entry",
    };
    const response = await request(DI.server)
      .post("/weightTrainingExerciseDiaryEntry")
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "WeightTrainingExercisePlan does not exist"
    );
  });

  it("can't create a diary entry for a weight training exercise plan because of missing data", async () => {
    const token = await createToken(app);
    const weightTrainingExercisePlan: WeightTrainingExercisePlan =
      testObjects.weightTrainingExercisePlan2;

    const requireData = {
      weightTrainingExercisePlan: weightTrainingExercisePlan._id,
      note: "test_diary_entry",
    };
    const response = await request(DI.server)
      .post("/weightTrainingExerciseDiaryEntry")
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can update a diary entry", async () => {
    const token = await createToken(app);
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry1;
    const requireData = {
      note: "test_diary_entry_update",
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExerciseDiaryEntry/updateDiaryEntry/${diaryEntry._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.date).toBe(diaryEntry.date.toISOString());
    expect(response.body.note).toBe(requireData.note);

    expect(response.body.weightTrainingExercisePlan.id).toEqual(
      diaryEntry.weightTrainingExercisePlan._id.toString()
    );
    expect(response.body.weightTrainingExercisePlan.title).toBe(
      diaryEntry.weightTrainingExercisePlan.title
    );
    expect(response.body.weightTrainingExercisePlan.description).toBe(
      diaryEntry.weightTrainingExercisePlan.description
    );
    expect(response.body.weightTrainingExercisePlan.users.length).toBe(
      diaryEntry.weightTrainingExercisePlan.users.length
    );
    expect(response.body.weightTrainingExercisePlan.createdByUser).toBe(
      diaryEntry.weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.weightTrainingExercisePlan.createdAt).toBe(
      diaryEntry.weightTrainingExercisePlan.createdAt.toISOString()
    );
    expect(response.body.weightTrainingExercisePlan.updatedAt).toBe(
      diaryEntry.weightTrainingExercisePlan.updatedAt.toISOString()
    );
  });

  it("can't update a diary entry because diary entry doesn't exist", async () => {
    const token = await createToken(app);
    const requireData = {
      note: "test_diary_entry_update",
    };

    const response = await request(DI.server)
      .put(`/weightTrainingExerciseDiaryEntry/updateDiaryEntry/1234567890AB`)
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("DiaryEntry does not exist");
  });

  it("can add repetition and amount", async () => {
    const token = await createToken(app);
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry2;
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise2;

    const requireData = {
      repetition: 10,
      setAmount: 10,
      weightTrainingExercise: weightTrainingExercise._id,
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExerciseDiaryEntry/addRepetitionAndAmount/${diaryEntry._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.date).toBe(diaryEntry.date.toISOString());
    expect(response.body.note).toBe(diaryEntry.note);

    expect(response.body.weightTrainingExercisePlan.id).toEqual(
      diaryEntry.weightTrainingExercisePlan._id.toString()
    );
    expect(response.body.weightTrainingExercisePlan.title).toBe(
      diaryEntry.weightTrainingExercisePlan.title
    );
    expect(response.body.weightTrainingExercisePlan.description).toBe(
      diaryEntry.weightTrainingExercisePlan.description
    );
    expect(response.body.weightTrainingExercisePlan.users.length).toBe(
      diaryEntry.weightTrainingExercisePlan.users.length
    );
    expect(response.body.weightTrainingExercisePlan.createdByUser).toBe(
      diaryEntry.weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.weightTrainingExercisePlan.createdAt).toBe(
      diaryEntry.weightTrainingExercisePlan.createdAt.toISOString()
    );
    expect(response.body.weightTrainingExercisePlan.updatedAt).toBe(
      diaryEntry.weightTrainingExercisePlan.updatedAt.toISOString()
    );
  });

  it("can't add repetition and amount because diary entry doesn't exist", async () => {
    const token = await createToken(app);
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise2;

    const requireData = {
      repetition: 10,
      setAmount: 10,
      weightTrainingExercise: weightTrainingExercise._id,
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExerciseDiaryEntry/addRepetitionAndAmount/1234567890AB`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("DiaryEntry does not exist");
  });

  it("can't add repetition and amount because of missing data", async () => {
    const token = await createToken(app);
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry2;
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise2;

    const requireData = {
      repetition: 10,
      weightTrainingExercise: weightTrainingExercise._id,
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExerciseDiaryEntry/addRepetitionAndAmount/${diaryEntry._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it("can update a exercise in a diary entry ", async () => {
    const token = await createToken(app);
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry2;
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise2;

    const requireData = {
      setAmount: 20,
      weightTrainingExercise: weightTrainingExercise._id,
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExerciseDiaryEntry/updateRepetitionAndAmount/${diaryEntry._id}`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(200);
    expect(response.body.date).toBe(diaryEntry.date.toISOString());
    expect(response.body.note).toBe(diaryEntry.note);

    expect(response.body.weightTrainingExercisePlan.id).toEqual(
      diaryEntry.weightTrainingExercisePlan._id.toString()
    );
    expect(response.body.weightTrainingExercisePlan.title).toBe(
      diaryEntry.weightTrainingExercisePlan.title
    );
    expect(response.body.weightTrainingExercisePlan.description).toBe(
      diaryEntry.weightTrainingExercisePlan.description
    );
    expect(response.body.weightTrainingExercisePlan.users.length).toBe(
      diaryEntry.weightTrainingExercisePlan.users.length
    );
    expect(response.body.weightTrainingExercisePlan.createdByUser).toBe(
      diaryEntry.weightTrainingExercisePlan.createdByUser
    );
    expect(response.body.weightTrainingExercisePlan.createdAt).toBe(
      diaryEntry.weightTrainingExercisePlan.createdAt.toISOString()
    );
    expect(response.body.weightTrainingExercisePlan.updatedAt).toBe(
      diaryEntry.weightTrainingExercisePlan.updatedAt.toISOString()
    );
  });

  it("can't update a exercise in a diary entry because diary entry doesn't exist", async () => {
    const token = await createToken(app);
    const weightTrainingExercise: WeightTrainingExercise =
      testObjects.weightTrainingExercise2;

    const requireData = {
      repetition: 20,
      setAmount: 50,
      weightTrainingExercise: weightTrainingExercise._id,
    };

    const response = await request(DI.server)
      .put(
        `/weightTrainingExerciseDiaryEntry/updateRepetitionAndAmount/1234567890AB`
      )
      .set("Authorization", token)
      .send(requireData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("DiaryEntry does not exist");
  });

  it("can delete a diary entry for a weight training exercise plan", async () => {
    const token = await createToken(app);
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry2;

    const response = await request(DI.server)
      .delete(`/weightTrainingExerciseDiaryEntry/${diaryEntry._id}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("can delete a diary entry for a weight training exercise plan", async () => {
    const token = await createToken(app);
    const diaryEntry: WeightTrainingExerciseDiaryEntry =
      testObjects.weightTrainingExerciseDiaryEntry2;

    const response = await request(DI.server)
      .delete(`/weightTrainingExerciseDiaryEntry/1234567890AB`)
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("DiaryEntry does not exist");
  });
});
