import { useDisconnect, useMetamask, useAddress } from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="flex flex-col h-screen lg:grid lg:grid-cols-10">
      <Head>
        <title>NFT Challenge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-1.5">
            <img
              className="object-center w-44 rounded-xl lg:h-96 lg:w-72"
              src="https://images.unsplash.com/photo-1656203549852-0fee2be87ffb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80"
              alt=""
            />
          </div>
          <div className="p-5 space-y-2 text-center">
            <h1 className="text-4xl font-bold text-white">This is an NFT</h1>
            <h2 className="text-xl text-gray-300">A collection of art</h2>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="flex flex-col flex-1 p-12 lg:col-span-6">
        {/* header */}
        <header className="flex items-center justify-between">
          <h1 className="text-xl cursor-pointer w-52 font-extralight sm:w-80">
            the{' '}
            <span className="font-extrabold underline decoration-pink-600/50">
              NFT
            </span>{' '}
            marketplace
          </h1>

          <button
            className="px-4 py-2 text-xs font-bold text-white rounded-full bg-rose-400 lg:px-5 lg:py-3 lg:text-base"
            onClick={() => (address ? disconnect() : connectWithMetamask())}
          >
            {address ? 'sign out' : 'sign in'}
          </button>
        </header>

        <hr className="my-2 border" />
        {address && (
          <p className="text-sm text-center text-red-400">
            You're logged in with your wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}

        {/* body */}
        <div className="flex flex-col items-center flex-1 mt-10 space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="object-cover pb-10 w-80 lg:h-40"
            src="https://images.unsplash.com/photo-1656356594492-b4d17dddbbe8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
            alt=""
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            this is the first collection drop her
          </h1>
          <p className="pt-2 text-xl text-green-500">13 / 21 claimed</p>
        </div>

        {/* footer */}
        <footer>
          <button className="w-full h-16 mt-10 font-bold text-white bg-red-500 rounded-full">
            mint this NFT (0.01 ETH)
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Home;
