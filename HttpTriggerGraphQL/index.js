const { graphiqlAzureFunctions } = require('apollo-server-azure-functions');

module.exports = function run(context, request) {
  let query = `
    {
      rands {
        id
        rand
      }
    }
  `;

  // End point points to the path to the GraphQL API function
  graphiqlAzureFunctions({ endpointURL: '/api/graphql', query })(
    context,
    request,
  );
}