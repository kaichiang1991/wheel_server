const getRandomResult = (dataArr)=>{
    const totalCount = dataArr.reduce((pre, curr) => pre + curr.count, 0)
    const index = Math.floor(Math.random() * totalCount)
    , key = dataArr.findIndex((data, idx) => 
        data.count > 0 &&
        index < dataArr.slice(0, idx + 1).reduce((pre, curr) => pre + curr.origCount, 0)
    )
    return dataArr[key].name    
}

module.exports = {
    getRandomResult
}