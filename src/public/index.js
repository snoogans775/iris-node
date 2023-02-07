const form = document.querySelector('#ui')
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const keyValues = Object.values(e.target).reduce((obj, field) => { obj[field.name] = field.value; return obj }, {});
    const filters = keyValuesToQueryBody(keyValues);
    const http = await fetchIntrusions(filters);
    const response = await http.json();
    
    const output = document.querySelector('#output');
    output.innerHTML = response.data.reduce((acc, curr) => {
        acc += '<tr>';
        acc += Object.values(curr).reduce((acc,curr) => {
            acc += '<td>' + curr + '</td>';
            return acc;
        }, '')
        acc += '</tr>';
        return acc;
    }, '')

    async function fetchIntrusions(filters) {
        return await fetch('/intruder/query', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer kfredericks-iris',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filters })
        })
    }
})


function keyValuesToQueryBody(keyValues) {
    return Object.keys(keyValues)
        .map(key => {
            return {
                "field": keyToField(key),
                "operator": keyToOperator(key),
                "value": keyValues[key]
            }
        })
        .filter(filter => {
            return filter.key !== '' &&
            filter.value !== ''
        })

    function keyToField(key) {
        return key.split('-').slice(-1)[0]
    }

    function keyToOperator(key) {
        const minOrMax = key.split('-').slice(0, 1)[0]
        return minOrMax === 'min' ? '>=' : '<=';
    }
}
