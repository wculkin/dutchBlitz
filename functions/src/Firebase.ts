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
  public async getFireStoreDocument(collectionName:string, docName:string) {
    const snapshot = await this.db.collection(collectionName).doc(docName).get();
    return snapshot.data();
  }

  public async updateDocument(path: string, data: Partial<any>): Promise<void> {
    const ref = this.realTime.ref(path);
    return ref.update(data)
      .then(() => {
        console.log(`Data updated successfully at path: ${path}`);
      })
      .catch((error) => {
        console.error(`Failed to update data at path: ${path}`, error);
      });
  }
  public async setDocument(path: string, data: any): Promise<void> {
    const ref = this.realTime.ref(path);
    return ref.set(data)
      .then(() => {
        console.log(`Data set successfully at path: ${path}`);
      })
      .catch((error) => {
        console.error(`Failed to set data at path: ${path}`, error);
      });
  }
  public async readDocument(path: string): Promise<any> {
    const ref = this.realTime.ref(path);
    try {
      const snapshot = await ref.once("value");
      if (!snapshot.exists()) {
        console.error(`No data found at path: ${path}`);
        return null;
      }
      console.log(`Data read successfully from path: ${path}`);
      return snapshot.val();
    } catch (error) {
      console.error(`Failed to read data from path: ${path}`, error);
    }
  }
}
