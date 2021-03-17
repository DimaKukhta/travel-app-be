import { MongoClient, Collection, ObjectID } from 'mongodb'
import { response } from 'express';

const url = 'mongodb+srv://dima:12345@cluster0.pglaf.mongodb.net/?retryWrites=true&w=majority';

const dbName = 'travel-app';
const collectionName = 'users'

type UserType = {
    login: string,
    password: string,
    avatar: any,
}

const getMongoInstance = async () => {
    const client = await MongoClient.connect(url);
        
    return client.db(dbName);
}

const getMongoCollection = async (): Promise<Collection> => {
    const db = await getMongoInstance();

    return db.collection(collectionName);
} 

const getUser = async (login: string) => {
    const collection = await getMongoCollection();
    return collection.findOne({ 'login' : `${login}` });
};

const getUserById = async (_id: string) => {
    const collection = await getMongoCollection();
    return collection.findOne({_id: new ObjectID(_id)});
}

const createUser = async (user: UserType) => {
    const collection = await getMongoCollection();

    const response =  await collection.insertOne(user);
    return response.ops[0];
};


export {
    getUser,
    createUser,
    getUserById
}