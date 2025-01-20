// imports methods relevant to the react framework
import * as React from "react";
// library we use to interact with the solana json rpc api
import * as web3 from "@solana/web3.js";
// allows us access to methods and components which give us access to the solana json rpc api and user's wallet data
import * as walletAdapterReact from "@solana/wallet-adapter-react";
// allows us to choose from the available wallets supported by the wallet adapter
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
// imports a component which can be rendered in the browser
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
// applies the styling to the components which are rendered on the browser
require("@solana/wallet-adapter-react-ui/styles.css");
// imports methods for deriving data from the wallet's data store
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Starter = () => {
  // add the wallet account balance to application
  const [balance, setBalance] = React.useState<number | null>(0);

  // specify which network to use for the application
  const endpoint = web3.clusterApiUrl("devnet");

  // spcecify which wallets to use in the application
  const wallets = [
    new walletAdapterWallets.BitgetWalletAdapter(),
    new walletAdapterWallets.PhantomWalletAdapter(),
  ];

  // connection context object that is injected into the browser by the wallet
  const { connection } = useConnection();

  // user's public key of the wallet they connected to the application
  const { publicKey } = useWallet();

  //   when the status of 'connection' or 'publicKey' changes, let the code useEffect hook handle the code change
  React.useEffect(() => {
    const getInfo = async () => {
      if (connection && publicKey) {
        // get the account info for the user's wallet data store and set the balance in the application's state
        const info = await connection.getAccountInfo(publicKey);
        setBalance(info!.lamports / web3.LAMPORTS_PER_SOL);
      }
    };
    getInfo();

    // the code above will execute when connection and publicKey changes
  }, [connection, publicKey]);

  return (
    <>
      {/* provides a connection to the solana json rpc api */}
      <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
        <walletAdapterReact.WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <main className="min-h-screen text-white">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                <div className="col-span-1 lg:col-start-2 lg:col-end-4 rounded-lg bg-[#2a302f] h-60 p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold">account info ✨</h2>
                    {/* button component for connecting to solana wallet */}
                    <WalletMultiButton className="!bg-helius-orange " />
                  </div>

                  <div className="mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
                    <ul className="p-2">
                      <li className="flex justify-between">
                        <p className="tracking-wider">Wallet is connected...</p>
                        <p className="text-turbine-green italic font-semibold">
                          {publicKey ? "yes" : "no"}
                        </p>
                      </li>

                      <li className="text-sm mt-4 flex justify-between">
                        <p className="tracking-wider">Balance</p>
                        <p className="text-turbine-green italic font-semibold">
                          {balance}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </main>
          </WalletModalProvider>
        </walletAdapterReact.WalletProvider>
      </walletAdapterReact.ConnectionProvider>
    </>
  );
};
// <BoilerPlate />
export default Starter;
