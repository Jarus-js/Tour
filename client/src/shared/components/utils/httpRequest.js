const sendHttpRequest = (method, url, data) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data), //stringify converts obj,array into json
    //body should be in json
    headers: data ? { "Content-Type": "application/json" } : {}
  }).then(response => {
    if (response.status >= 400) {
      return response
        .json() //return inner promise so it can become parto with outer promise
        .then(errResData => {
          throw new Error(errResData.message);
        });
    }
    //return promise that throw an error or return body data
    return response.json();
  });
};
export default sendHttpRequest;
