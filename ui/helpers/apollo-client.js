import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/sasicodes/snapdraw",
    cache: new InMemoryCache(),
});

export default client;