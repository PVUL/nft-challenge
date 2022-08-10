import Head from 'next/head';
import {
  useDisconnect,
  useMetamask,
  useAddress,
  useNFTDrop,
  useNFTs,
  ThirdwebNftMedia,
} from '@thirdweb-dev/react';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Props {
  collection: Collection;
}

const Nft = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [priceInEth, setPriceInEth] = useState<string>();
  const contract = useNFTDrop(collection.address);
  const { data: nfts, isLoading } = useNFTs(contract);

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (!contract) return;
    const fetchPrice = async () => {
      const claimConditions = await contract.claimConditions.getAll();
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
    };

    fetchPrice();
  }, []);

  useEffect(() => {
    if (!contract) return;

    const fetchcontractData = async () => {
      setLoading(true);
      const claimed = await contract.getAllClaimed();
      const totalSupply = await contract.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(totalSupply?.toNumber());
      setLoading(false);
    };

    fetchcontractData();
  }, [contract]);

  const mintNft = () => {
    // fire off when purchase is made
    if (!contract || !address) return;
    const mintQty = 1; // the quantity of NFT to be minted

    setLoading(true);
    // this "claiming" process takes awhile, so we should think about how to not lock up the UI!
    contract
      .claimTo(address, mintQty)
      .then(async (tx) => {
        const receipt = tx[0].receipt; // transaction receipt
        const claimedTokenId = tx[0].id; // id of NFT claimed
        const claimedNft = await tx[0].data(); // optional - get the claimed NFT metadata

        console.log(receipt);
        console.log(claimedTokenId);
        console.log(claimedNft);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
              src={urlFor(collection.previewImage).url()}
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
          <Link href="/">
            <h1 className="text-xl cursor-pointer w-52 font-extralight sm:w-80">
              the{' '}
              <span className="font-extrabold underline decoration-pink-600/50">
                NFT
              </span>{' '}
              marketplace
            </h1>
          </Link>

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
            src={urlFor(collection.mainImage).url()}
            alt=""
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.nftCollectionName}
          </h1>
          <p className="py-2">{collection.description}</p>
          {loading ? (
            <p className="pt-2 text-xl text-green-500 animate-pulse">
              loading...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply} claimed
            </p>
          )}

          <div>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {nfts?.map((nft, id) => (
                  <>
                    <ThirdwebNftMedia key={id} metadata={nft.metadata} />
                    <h3>name: {nft.metadata.name}</h3>
                    <h3>description: {nft.metadata.description}</h3>
                    <h3>uri: {nft.metadata.uri}</h3>
                    <h3>supply: {nft.supply}</h3>
                    <h3>owner: {nft.owner}</h3>
                    <br />
                  </>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <footer>
          <button
            onClick={mintNft}
            disabled={loading || claimedSupply === totalSupply || !address}
            className="w-full h-16 mt-10 font-bold text-white bg-red-500 rounded-full disabled:bg-gray-400"
          >
            {/* chaining ternary's - might want to move this into another function  */}
            {loading ? (
              <>loading...</>
            ) : claimedSupply === totalSupply ? (
              <>Sold out</>
            ) : !address ? (
              <>sign in to mint</>
            ) : (
              <span>mint this NFT ({priceInEth} ETH)</span>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

// we're doing SSR right now - need to evaluate if we should move to SSG + ISR
// SSG might make sense here...
// note: can move to SSG with `getStaticProps` and `getStaticPaths`
export const getServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
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

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    },
  };
};

export default Nft;
