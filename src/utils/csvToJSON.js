async function csvToJSON(csvString, config) {
    const csv = require('fast-csv')
    const rows = await new Promise((resolve, reject) => {
        let result = []
        csv.parseString(csvString, { headers: true })
        .on('error', error => console.error(error))
        .on('data', row => result.push(row))
        .on('end', rowCount => resolve(result));
    })
    return rows
}

module.exports = { csvToJSON }