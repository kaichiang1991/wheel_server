const {MongoClient} = require('mongodb')

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
 * 將資料寫入資料庫
 * @param {*} title collection名稱
 * @param {*} itemArr 要記錄的品項
 */
async function setData(title, itemArr){
    const dbName = 'wheel'
    const db = client.db(dbName)

    // 先判斷是否存在，存在的話先從資料庫刪除
    console.log(await db.listCollections({name: title}))
    console.log('list done')
    const exist = (await db.listCollections({name: title}).toArray()).length != 0
    console.log('exist', exist)
    if(exist){
        await db.dropCollection(title)
    }

    console.log('drop donw')
    const col = db.collection(title)
    console.log('collection done')
    const modItemArr = itemArr.map(item => ({name: item.item, count: +item.count}))
    await col.insertMany(modItemArr)
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
    await col.updateOne({name}, updateObj)
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
    setData, updateData, getData, readDataByTitle, writeDataTo
}