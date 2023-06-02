import { NextFunction, Request, RequestHandler, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { DI } from "..";
import { User } from "../entities";
import { logger } from "../utils";

const prepareAuthentication = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    await getAuth()
      .verifyIdToken(authHeader)
      .then(async (decodedToken) => {
        const firebaseUid = decodedToken.uid;
        const user: User | null = await DI.userRepository.findOne({
          firebaseUid: firebaseUid,
        });
        req.user = user;
      })
      .catch((error) => {
        logger
          .child({
            context: {
              controller: "Auth",
              request: "prepareAuthentication",
              authHeader: authHeader,
            },
          })
          .error({ error: error });
      });
  } else {
    req.user = null;
  }
  next();
};

const verifyAccess: RequestHandler = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ errors: `You don't have access` });
  }
  next();
};

export const Auth = {
  prepareAuthentication,
  verifyAccess,
};
