import * as admin from "firebase-admin";
export class Firebase {
  db : admin.firestore.Firestore;
  realTime: admin.database.Database;

  constructor() {
    console.log("Firebase initialized...");
    try {
      // Firestore instance
      this.db = admin.firestore();
      // Realtime Database instance
      this.realTime = admin.database();
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      throw new Error("Failed to initialize Firebase");
    }
  }
  public async setFireStoreDoc(collectionName:string, docName:string, data:any) {
    await this.db.collection(collectionName).doc(docName).set(data);
  }
  public async updateFireStoreDoc(collectionName:string, docName:string, data:any) {
    await this.db.collection(collectionName).doc(docName).update(data);
  }
}
