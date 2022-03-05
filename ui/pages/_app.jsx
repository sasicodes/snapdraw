import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { chain } from "wagmi";
import { providers } from "ethers";
import { Toaster } from "react-hot-toast";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

const connectors = [
  new InjectedConnector({
    chains: [chain.polygonTestnetMumbai],
  }),
];

const provider = () => new providers.JsonRpcProvider(rpcUrl);

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Snapdraw - Draw and mint anything.</title>
      </Head>
      <Provider
        connectors={connectors}
        provider={provider}
        autoConnect
        connectorStorageKey="snapdraw.wallet"
      >
        <Toaster position="top-right" />
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default MyApp;
