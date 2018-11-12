"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_core_1 = require("apollo-server-core");
var GraphiQL = require("apollo-server-module-graphiql");
function graphqlAzureFunctions(options) {
    if (!options) {
        throw new Error('Apollo Server requires options.');
    }
    if (arguments.length > 1) {
        throw new Error("Apollo Server expects exactly one argument, got " + arguments.length);
    }
    return function (httpContext, request) {
        var queryRequest = {
            method: request.method,
            options: options,
            query: request.method === 'POST' ? request.body : request.query,
        };
        if (queryRequest.query && typeof queryRequest.query === 'string') {
            queryRequest.query = JSON.parse(queryRequest.query);
        }
        return apollo_server_core_1.runHttpQuery([httpContext, request], queryRequest)
            .then(function (gqlResponse) {
                // var result = {
                //     status: 200,
                //     headers: { 'Content-Type': 'application/json' },
                //     body: gqlResponse,
                // };
                // httpContext.res = result;
                // httpContext.done(null, result);
                httpContext.res.setHeader('Content-Type', 'application/json');
                httpContext.res.raw(gqlResponse);
                httpContext.done(null, httpContext.res);
            })
            .catch(function (error) {
                var result = {
                    status: error.statusCode,
                    headers: error.headers,
                    body: error.message,
                };
                httpContext.res = result;
                httpContext.done(null, result);
            });
    };
}
exports.graphqlAzureFunctions = graphqlAzureFunctions;
function graphiqlAzureFunctions(options) {
    return function (httpContext, request) {
        var query = request.query;
        GraphiQL.resolveGraphiQLString(query, options, httpContext, request).then(function (graphiqlString) {
            // httpContext.res = {
            //     status: 200,
            //     headers: {
            //         'Content-Type': 'text/html; charset-utf-8',
            //     },
            //     body: graphiqlString,
            // };
            // httpContext.done(null, httpContext.res);
            httpContext.res.setHeader('Content-Type', 'text/html; charset-utf-8');
            httpContext.res.raw(graphiqlString);
            httpContext.done(null, httpContext.res);
        }, function (error) {
            httpContext.res = {
                status: 500,
                body: error.message,
            };
            httpContext.done(null, httpContext.res);
        });
    };
}
exports.graphiqlAzureFunctions = graphiqlAzureFunctions;