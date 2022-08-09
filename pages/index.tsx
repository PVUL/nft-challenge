import { useDisconnect, useMetamask, useAddress } from '@thirdweb-dev/react';
import Head from 'next/head';
import { sanityClient, urlFor } from '../sanity';
import { Collection } from '../typings';
import Link from 'next/link';

interface Props {
  collections: Collection[];
}

const Home = ({ collections }: Props) => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="flex flex-col min-h-screen p-10 mx-auto max-w-7xl 2xl:px-0">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col flex-1 p-12 lg:col-span-10">
        <header className="flex items-center justify-between p-5">
          <h1 className="text-3xl cursor-pointer w-52 font-extralight sm:w-80">
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
        <p className="text-sm text-center text-red-400 h-14">
          {address &&
            `You're logged in with your wallet ${address.substring(0, 5)}...
            ${address.substring(address.length - 5)}`}
        </p>

        {/* body */}
        <main className="p-10 shadow-xl bg-slate-100 shadow-rose-40">
          <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {collections.map((collection) => (
              <Link href={`/nft/${collection.slug.current}`}>
                <div className="flex flex-col items-center transition-all duration-200 cursor-pointer hover:scale-105">
                  <img
                    className="object-cover rounded-2xl w-80 lg:h-96"
                    src={urlFor(collection.mainImage).url()}
                    alt=""
                  />
                  <div>
                    <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
                      {collection.title}
                    </h1>
                    <p>{collection.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export const getStaticProps = async ({}) => {
  const query = `*[_type == "collection"]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`;

  const collections = await sanityClient.fetch(query);

  return {
    props: {
      collections,
    },
  };
};

export default Home;
