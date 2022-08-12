/* these API methods will call the functions in the backend to make the database things do */

const getall = () => {
    return fetch('/.netlify/functions/getall')
    .then((response) => {
        return response.json();
    });
};

const api = {
    getall,
};

export default api;
