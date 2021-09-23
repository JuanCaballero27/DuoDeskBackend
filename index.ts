const {ApolloServer} = require('apollo-server-express')
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'
import { resolve } from 'path/posix'
import app from './App'
import typeDefs from './GraphQL/typeDefs'

const resolvers = {}
type typeDefs = any[]

const startApolloServer = async (typeDefs: typeDefs, resolvers: object) => {
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve, reject) => httpServer.listen({ port: 5000 }));
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)