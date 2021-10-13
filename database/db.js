const {MongoClient} = require('mongodb')
const { getRandomResult } = require('./math')

const uri = "mongodb+srv://kai:Chiang01@cluster0.mqe37.mongodb.net/Cluster0?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function run(){
    try{
        console.log('start connect db')
        await client.connect()
        console.log('connect done')
    }catch(err){
        console.error(err.stack)
    }
    finally{

    }
}

run().catch(console.dir)

/**
 * 從資料庫取得資料
 * @param {*} title collection 名稱 
 * @returns {Array<Object>}
 */
async function readDataByTitle(title){
    const dbName = 'wheel'
    const db = client.db(dbName)
    const col = db.collection(title)

    const result = col.find({}, {projection: {_id: 0}})
    return result.toArray()
}

/**
 * 寫入資料到資料庫
 * @param {*} title collection 名稱
 * @param {*} dataArr 資料陣列
 */
async function writeDataTo(title, dataArr){
    const dbName = 'wheel'
    const db = client.db(dbName)
    
    // 先刪除
    try{
        await db.dropCollection(title)
    }catch(err){
        console.log('刪除，尚未建立資料庫', title)
    }
    finally{
        // 建立新表格並插入資料
        db.collection(title).insertMany(dataArr)
    }
}

/**
 * 取得輪盤結果
 * @param {*} title 
 * @returns {string} 結果的名稱
 */
async function getResultData(title){
    const dbName = 'wheel'
    const db = client.db(dbName)
    const dataArr = await db.collection(title).find({}).toArray()    
    const result = getRandomResult(dataArr)
    return result
}

/**
 * 更新資料 (減少計數)
 * @param {*} title 表格名稱 
 * @param {*} name 項目名稱
 */
async function updateData(title, name){
    const dbName = 'wheel'
    const db = client.db(dbName)
    const col = db.collection(title)

    const updateObj = {
        $inc: {count: -1}
    }
    const result = await col.updateOne({name}, updateObj)
    return result
}

/**
 * 取得還有剩餘數量的資料
 * @param {*} title 
 * @returns 
 */
async function getData(title){
    const dbName = 'wheel'
    const db = client.db(dbName)
    const col = db.collection(title)

    const result = col.find({count: {
        $gt: 0
    }}, {projection: {_id: 0}})

    return result.toArray()
}

module.exports = {
    updateData, getData, readDataByTitle, writeDataTo, getResultData
}