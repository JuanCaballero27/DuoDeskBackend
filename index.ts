import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'

import app from './App'

import typeDefs from './GraphQL/schemas'

type typeDefs = any[]
const resolvers = {}

const startApolloServer = async (typeDefs: typeDefs, resolvers: {}) => {
	const httpServer = http.createServer(app);
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});
	await server.start();
	server.applyMiddleware({ app });
	console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
	await new Promise((resolve, reject) => httpServer.listen({ port: 5000 }));
}

startApolloServer(typeDefs, resolvers)