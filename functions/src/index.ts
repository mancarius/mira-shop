import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const env = functions.config();
const db = admin.firestore();

import * as algoliasearch from 'algoliasearch';

// Initilalize the Algolia Client
const client = algoliasearch.default(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('mira-shop');

export const indexItems = functions.firestore
  .document('products/{objectId}')
  .onCreate((snap) => {
    const data = snap.data();
    const objectId = snap.id;
    // Add index on Algolia
    return index.saveObject({
      objectId,
      ...data,
    });
  });

export const unindexAnimal = functions.firestore
  .document('products/{objectId}')
  .onDelete((snap, context) => {
    const objectId = snap.id;
    // Remove index from Algolia
    return index.deleteObject(objectId);
  });

// Keeps track of the length of the 'likes' child list in a separate property.
export const countItemsCreate = functions.firestore
  .document('products/{objectId}')
  .onCreate(async (change) => {
    const collectionRef = change.ref.parent;
    const counterRef = collectionRef.doc('__length');
    const counterDoc = await counterRef.get();

    if (counterDoc.exists) {
      const increment = counterDoc.data()?.value ?? 0;
      await counterRef.update({ value: Number(increment) + 1 });
    } else {
      await counterRef.set({ value: 1 });
    }
  });

export const countItemsDelete = functions.firestore
  .document('products/{objectId}')
  .onDelete(async (change) => {
    const collectionRef = change.ref.parent;
    const counterRef = collectionRef.doc('__length');
    const counterDoc = await counterRef.get();

    if (counterDoc.exists) {
      const increment = counterDoc.data()?.value ?? 1;
      await counterRef.update({ value: Number(increment) - 1 });
    }
  });

export const updateCategoriesOnDocumentWrite = functions.firestore
  .document('products/{objectId}')
  .onWrite(async (change) => {
    console.log('Start');
    const itemsCollection = db.collection('products');
    const categoryCollection = db.collection('categories');
    const itemCategories = {
      before: (change.before.data()?.categories ?? []) as string[],
      after: (change.before.data()?.categories ?? []) as string[],
    };

    const deletedCategories = itemCategories.before.filter((category) => {
      const notExist = !itemCategories.after.some(() => category);
      return notExist;
    });
    console.log('deletedCategories', deletedCategories);

    const addedCategories = itemCategories.after.filter((category) => {
      const notExist = !itemCategories.before.some(() => category);
      return notExist;
    });
    console.log('addedCategories', addedCategories);

    // remove assigned categories
    const toDelete = deletedCategories.filter(async (category) => {
      const result = await itemsCollection
        .where('categories', 'array-contains', category)
        .get();
      return result.size === 0;
    });
    console.log('toDelete', toDelete);

    // remove existing categories
    const toAdd = addedCategories.filter(async (category) => {
      const result = await categoryCollection
        .where('name', '==', category)
        .get();
      return result.size === 0;
    });
    console.log('toAdd', toAdd);

    // remove categories from collection
    if (toDelete.length > 0) {
      try {
        const query = await categoryCollection
          .where('name', 'in', toDelete)
          .get();

        query.docs.forEach(async (doc) => {
          await doc.ref.delete();
        });
      } catch (error) {
        console.warn(error);
      }
    }
    // add categories to collection
    if (toAdd.length > 0) {
      toAdd.forEach(async (category) => {
        try {
          await categoryCollection.doc().set({
            name: category,
          });
        } catch (error) {
          console.warn(error);
        }
      });
    }
  });


export const updateLastCartUpdate = functions.firestore
  .document('carts/{objectId}')
  .onUpdate(async (snap, context) => {
    if (
      snap.before.data().lastUpdate === snap.after.data().lastUpdate ||
      snap.before.data().lastUpdate === undefined
    ) {
      await admin
        .firestore()
        .doc(`carts/${context.params.objectId}`)
        .update({
          lastUpdate: snap.after.updateTime,
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
