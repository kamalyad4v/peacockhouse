import { MongoClient, Db } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

// File-based mock fallback for development without MONGO_URL
const MOCK_FILE_PATH = path.join(process.cwd(), 'mock_db.json');

function readMockDb() {
  try {
    if (fs.existsSync(MOCK_FILE_PATH)) {
      const data = fs.readFileSync(MOCK_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading mock database file:', err);
  }
  return { newsletter_signups: [], status_checks: [] };
}

function writeMockDb(data: any) {
  try {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to mock database file:', err);
  }
}

const mockDb = {
  collection(name: string) {
    return {
      async findOne(query: any) {
        const dbData = readMockDb();
        const list = dbData[name] || [];
        return list.find((item: any) => {
          for (const key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        }) || null;
      },
      async insertOne(doc: any) {
        const dbData = readMockDb();
        if (!dbData[name]) dbData[name] = [];
        dbData[name].push(doc);
        writeMockDb(dbData);
        return { acknowledged: true, insertedId: doc.id || doc._id };
      },
      async countDocuments(query: any) {
        const dbData = readMockDb();
        const list = dbData[name] || [];
        const filtered = list.filter((item: any) => {
          for (const key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
        return filtered.length;
      },
      find(query: any, options?: any) {
        const dbData = readMockDb();
        const list = dbData[name] || [];
        const filtered = list.filter((item: any) => {
          for (const key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
        let result = filtered;
        if (options && options.projection) {
          result = filtered.map((item: any) => {
            const newItem = { ...item };
            for (const key in options.projection) {
              if (options.projection[key] === 0) {
                delete newItem[key];
              }
            }
            return newItem;
          });
        }
        return {
          async toArray() {
            return result;
          }
        };
      }
    };
  }
};

export async function getDb(): Promise<Db> {
  if (!uri) {
    console.log('MONGO_URL not set. Falling back to local mock_db.json file.');
    return mockDb as unknown as Db;
  }
  const connection = await clientPromise;
  return connection.db(dbName || 'peacock');
}

