const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = (event, context) => {
    const client = new faunadb.Client({
        secret: process.env.FAUNADB_SECRET,
        domain: 'db.us.fauna.com',
        port: 443,
        scheme: 'https',
    });
console.log('get all')
    return client
        .query(q.Paginate(q.Match(q.Ref('indexes/all_codes'))))
        .then((response) => {
            const dataRefs = response.data;

            const getQuery = dataRefs.map((ref) => {
                return q.Get(ref);
            });

            return client.query(getQuery).then((ret) => {
                return {
                    statusCode: 200,
                    body: JSON.stringify(ret),
                };
            });
        })
        .catch((error) => {
            console.log('error', error);
            return {
                statusCode: 400,
                body: JSON.stringify(error),
            };
        });
};
