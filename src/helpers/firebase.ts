import { BadRequestException } from '@nestjs/common';
import {
  auth,
  credential,
  initializeApp,
  ServiceAccount,
} from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as serviceAccount from '../../../firebase.json';

const firebaseCert: ServiceAccount = {
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  privateKey: serviceAccount.private_key,
};

export function setupFirebase() {
  initializeApp({
    credential: credential.cert(firebaseCert),
  });
}

export async function verifyFirebaseIdToken(
  firebaseIdToken: string,
  typeProvider?: string,
) {
  try {
    const decoded = await auth().verifyIdToken(firebaseIdToken);

    if (typeProvider && decoded.firebase.sign_in_provider != typeProvider) {
      throw new BadRequestException('error.auth.verify');
    }

    return decoded;
  } catch (error) {
    throw new BadRequestException('error.auth.verify');
  }
}
