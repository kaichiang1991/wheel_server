var express = require('express');
const { readDataByTitle, writeDataTo, getResultData, updateData } = require('../database/db');
var router = express.Router();

/* GET users listing. */
router.get('/:title', async function(req, res, next) {
  const {title} = req.params
  const dataArr = await readDataByTitle(title)
  res.json(JSON.stringify(dataArr))
});

router.get('/:title/result', async function(req, res, next){
  const {title} = req.params
  const result = await getResultData(title)
  res.json(JSON.stringify({result}))
})

router.post('/:title', async function(req, res, next){
  const {params: {title}, body: {dataArr}} = req
  await writeDataTo(title, dataArr)
  res.json(JSON.stringify(dataArr))
})

router.patch('/:title/:name', async function(req, res, next){
  const {title, name} = req.params
  const result = await updateData(title, name)
  res.json(JSON.stringify(result))
})
module.exports = router;
