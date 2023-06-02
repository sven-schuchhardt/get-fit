import { getAuth, UserRecord } from "firebase-admin/auth";
import { User } from "../src/entities";
import { testObjects } from "../src/seeders/TestSeeder";
import * as getAuthFe from "firebase/auth";
import { FirebaseApp } from "@firebase/app";

export const createToken = async (
  app: FirebaseApp,
  user: User = testObjects.user1
) => {
  // https://stackoverflow.com/questions/44368643/verifying-firebase-custom-token-to-get-token-id-fails-when-using-jsonwebtoken
  const customToken = await getAuth().createCustomToken(user.firebaseUid);

  const userCredential: getAuthFe.UserCredential =
    await getAuthFe.signInWithCustomToken(getAuthFe.getAuth(app), customToken);
  const token = await userCredential.user.getIdToken();

  return token;
};

export const createFirebaseUser = async (email: string) => {
  const firebaseUser: UserRecord = await getAuth().createUser({
    email: email,
    password: "secretPassword",
  });

  return firebaseUser.uid;
};

export const deleteUserByEmail = async (email: string) => {
  const userRecord = await getAuth().getUserByEmail(email);
  await getAuth().deleteUser(userRecord.uid);
};
