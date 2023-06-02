import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import {
  BodyPart,
  WeightTrainingExerciseDiaryEntry,
  DiaryEntryWeightTrainingExercise,
  User,
  WeightTrainingExercise,
  WeightTrainingExercisePlan,
  WeightTrainingExercisePlanWeightTrainingExercise,
  Days,
} from "../entities";
import { getAuth, UserRecord } from "firebase-admin/auth";

export let testObjects: any = {};

export class TestSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user1 = await this.newUser(em, "user1", "user1@example.com");
    const user2 = await this.newUser(em, "user2", "user2@example.com");
    const user3 = await this.newUser(em, "user3", "user3@example.com");

    const bodyPart1 = this.newBodyPart(
      em,
      "bodyPart1",
      "seeder test bodyPart1"
    );
    const bodyPart2 = this.newBodyPart(
      em,
      "bodyPart2",
      "seeder test bodyPart2"
    );
    const bodyPart3 = this.newBodyPart(
      em,
      "bodyPart3",
      "seeder test bodyPart3"
    );

    const weightTrainingExercise1 = this.newWeightTrainingExercise(
      em,
      "weightTrainingExercise1",
      "seeder test weightTrainingExercise1",
      bodyPart1,
      false,
      user1
    );
    const weightTrainingExercise2 = this.newWeightTrainingExercise(
      em,
      "weightTrainingExercise2",
      "seeder test weightTrainingExercise2",
      bodyPart2,
      false,
      user2
    );
    const weightTrainingExercise3 = this.newWeightTrainingExercise(
      em,
      "weightTrainingExercise3",
      "seeder test weightTrainingExercise3",
      bodyPart3,
      true,
      user3
    );

    const weightTrainingExercise4 = this.newWeightTrainingExercise(
      em,
      "weightTrainingExercise4",
      "seeder test weightTrainingExercise4",
      bodyPart3,
      false,
      user3
    );

    const weightTrainingExercise5 = this.newWeightTrainingExercise(
      em,
      "weightTrainingExercise5",
      "seeder test weightTrainingExercise5",
      bodyPart3,
      false,
      user3
    );

    const weightTrainingExercisePlan1 = this.newWeightTrainingExercisePlan(
      em,
      "weightTrainingExercisePlan1",
      "seeder test weightTrainingExercisePlan1",
      user1,
      false
    );

    const weightTrainingExercisePlan2 = this.newWeightTrainingExercisePlan(
      em,
      "weightTrainingExercisePlan2",
      "seeder test weightTrainingExercisePlan2",
      user2,
      false
    );

    const weightTrainingExercisePlan3 = this.newWeightTrainingExercisePlan(
      em,
      "weightTrainingExercisePlan3",
      "seeder test weightTrainingExercisePlan3",
      user3,
      true
    );

    const weightTrainingExercisePlanWeightTrainingExercise1_1 =
      this.newWeightTrainingExercisePlanWeightTrainingExercise(
        em,
        "weightTrainingExercisePlanWeightTrainingExercise1_1",
        weightTrainingExercisePlan1,
        weightTrainingExercise1
      );

    const weightTrainingExercisePlanWeightTrainingExercise1_2 =
      this.newWeightTrainingExercisePlanWeightTrainingExercise(
        em,
        "weightTrainingExercisePlanWeightTrainingExercise1_2",
        weightTrainingExercisePlan1,
        weightTrainingExercise2
      );

    const weightTrainingExercisePlanWeightTrainingExercise3_4 =
      this.newWeightTrainingExercisePlanWeightTrainingExercise(
        em,
        "weightTrainingExercisePlanWeightTrainingExercise3_4",
        weightTrainingExercisePlan3,
        weightTrainingExercise4
      );

    const weightTrainingExercisePlanWeightTrainingExercise3_3 =
      this.newWeightTrainingExercisePlanWeightTrainingExercise(
        em,
        "weightTrainingExercisePlanWeightTrainingExercise3_3",
        weightTrainingExercisePlan3,
        weightTrainingExercise3
      );

    const weightTrainingExerciseDiaryEntry1 =
      this.newWeightTrainingExerciseDiaryEntry(
        em,
        "weightTrainingExerciseDiaryEntry1",
        weightTrainingExercisePlan1
      );

    const weightTrainingExerciseDiaryEntry2 =
      this.newWeightTrainingExerciseDiaryEntry(
        em,
        "weightTrainingExerciseDiaryEntry2",
        weightTrainingExercisePlan1
      );

    const weightTrainingExerciseDiaryEntry3 =
      this.newWeightTrainingExerciseDiaryEntry(
        em,
        "weightTrainingExerciseDiaryEntry3",
        weightTrainingExercisePlan1
      );

    const diaryEntryWeightTrainingExercise1_1 =
      this.newDiaryEntryWeightTrainingExercise(
        em,
        "diaryEntryWeightTrainingExercise1_1",
        weightTrainingExerciseDiaryEntry1,
        weightTrainingExercise1
      );

    const diaryEntryWeightTrainingExercise1_2 =
      this.newDiaryEntryWeightTrainingExercise(
        em,
        "diaryEntryWeightTrainingExercise1_2",
        weightTrainingExerciseDiaryEntry1,
        weightTrainingExercise2
      );
  }

  newBodyPart(em: EntityManager, key: string, name: string) {
    const bodyPart = em.create(BodyPart, {
      bodyPart: name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    testObjects[`${key}`] = bodyPart;
    return bodyPart;
  }

  newWeightTrainingExercise(
    em: EntityManager,
    key: string,
    name: string,
    bodyPart: BodyPart,
    createdByUser: boolean,
    user: User
  ) {
    const weightTrainingExercise = em.create(WeightTrainingExercise, {
      description: "seeder weightTraining",
      name: name,
      bodyPart: bodyPart,
      muscleGroup: "pectorals",
      videoLink: "https://example.com/",
      equipment: "body weight",
      imageOrGifUrl: "https://example.com/",
      createdByUser: createdByUser,
      type: "weightTraining",
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [user],
    });
    testObjects[`${key}`] = weightTrainingExercise;
    return weightTrainingExercise;
  }

  async newUser(em: EntityManager, key: string, email: string) {
    const firebaseUser: UserRecord = await getAuth().createUser({
      email: email,
      password: "secretPassword",
    });

    const user = em.create(User, {
      firebaseUid: firebaseUser.uid,
      email: email,
      firstName: "Max",
      lastName: "Mustermann",
      birthday: "1990-01-02",
      createdAt: new Date(),
      updatedAt: new Date(),
      activePlan: undefined,
    });
    testObjects[`${key}`] = user;
    return user;
  }

  newWeightTrainingExercisePlanWeightTrainingExercise(
    em: EntityManager,
    key: string,
    weightTrainingExercisePlan: WeightTrainingExercisePlan,
    weightTrainingExercise: WeightTrainingExercise
  ) {
    const weightTrainingExercisePlanWeightTrainingExercise = em.create(
      WeightTrainingExercisePlanWeightTrainingExercise,
      {
        exercisePlan: weightTrainingExercisePlan,
        exercise: weightTrainingExercise,
        setAmount: 3,
        repetition: 10,
        days: [Days.MON, Days.TUE],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
    testObjects[`${key}`] = weightTrainingExercisePlanWeightTrainingExercise;
    return weightTrainingExercisePlanWeightTrainingExercise;
  }

  newWeightTrainingExercisePlan(
    em: EntityManager,
    key: string,
    name: string,
    user: User,
    createdByUser: boolean
  ) {
    const weightTrainingExercisePlan = em.create(WeightTrainingExercisePlan, {
      title: name,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdByUser: createdByUser,
      type: "weightTraining",
      description: "seeder weightTraining",
    });
    weightTrainingExercisePlan.users.add(user);
    user.activePlan = weightTrainingExercisePlan;
    testObjects[`${key}`] = weightTrainingExercisePlan;
    return weightTrainingExercisePlan;
  }

  newWeightTrainingExerciseDiaryEntry(
    em: EntityManager,
    key: string,
    plan: WeightTrainingExercisePlan
  ) {
    const date: Date = new Date();
    date.setHours(0, 0, 0, 0);

    const diaryEntry = em.create(WeightTrainingExerciseDiaryEntry, {
      date: date,
      createdAt: new Date(),
      updatedAt: new Date(),
      note: "seeder diaryEntry",
      weightTrainingExercisePlan: plan,
    });
    testObjects[`${key}`] = diaryEntry;
    return diaryEntry;
  }

  newDiaryEntryWeightTrainingExercise(
    em: EntityManager,
    key: string,
    diaryEntry: WeightTrainingExerciseDiaryEntry,
    exercise: WeightTrainingExercise
  ) {
    const diaryEntryWeightTrainingExercise = em.create(
      DiaryEntryWeightTrainingExercise,
      {
        diaryEntry: diaryEntry,
        exercise: exercise,
        createdAt: new Date(),
        updatedAt: new Date(),
        setAmount: 150,
        repetition: 10,
      }
    );
    testObjects[`${key}`] = diaryEntryWeightTrainingExercise;
    return diaryEntryWeightTrainingExercise;
  }
}
