//sends a fetch request to a given route
export const fetchPost = (route, values, callback) => {
    fetch(`http://viggylab.com:3001/${route}`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
    })
    .then(resp => resp.json())
    .then(data => {
        callback(data);
    })
}

//sends a get request to a given route
export const fetchGet = (route, value, callback) => {
    fetch(`http://viggylab.com:3001/${route}/${value}`, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
    })
    .then(resp => resp.json())
    .then(data => {
        callback(data);
    })
}