import { createClient } from "urql";

const client = createClient({
    url: "https://api.thegraph.com/subgraphs/name/sasicodes/snapdraw"
})

export default client;