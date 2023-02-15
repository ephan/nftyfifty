"use client";
import { Theme, Button, Card, Hero } from "react-daisyui";

import { useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import axios from "axios";

const queryClient = new QueryClient();

const API_KEY = "k-j8x1a1RvnDTDMfcXOllw7C-yb-CZSNNG5NBff6oISsLn5c";
const PAGE_SIZE = 10;

export default function Gallery() {
  const [page, setPage] = useState(0);
  const [displayArr, setDisplayArr] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");

  const queryClient = useQueryClient();

  const url = useMemo(() => {
    return `https://svc.blockdaemon.com/nft/v1/ethereum/mainnet/collections?apiKey=${API_KEY}&verified=true&page_size=${PAGE_SIZE}&page_token=${nextPageToken}`
  }, [nextPageToken])

  async function fetchPopularCollections({ pageParam = 0 }) {
    const response = await axios.get(
      url
    );
    return response.data;
  }

  const { data, isLoading, isFetching, isError, refetch} =
    useQuery("popular-collections", fetchPopularCollections, {
      onSuccess: (data) => {
        console.log(data);
        setDisplayArr(data?.data);

        queryClient.prefetchQuery({
          queryKey: ['popular-collections'],
          queryFn: fetchPopularCollections,
        })
      },
    });

  const handleLoadMore = () => {
      setNextPageToken(data?.meta.paging.next_page_token);
      refetch();
  };

  type Collection = {
    id: string;
    name: string;
    logo: string;
    verified: boolean;
    contracts: string[];
  };
  

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full">
        <Hero >
      <Hero.Overlay className="bg-opacity-60" />
      <Hero.Content className="text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">NFTy Fifty</h1>
          <h2>Most Popular NFT Collections</h2>
        </div>
      </Hero.Content>
    </Hero>
    <Button onClick={handleLoadMore} className="w-42 block mx-auto my-5" disabled={isLoading}>
              Load More
            </Button>

            {(isLoading || isFetching) ? <p>Loading...</p> : null}
            {(isError) ? <p>Error...</p> : null}

        {(!isLoading && !isError) && (
        <ul className="grid grid-cols-4 gap-4">
          {displayArr?.map((collection: Collection, index: number) => (
            <Card key={collection.id}>
              <Card.Image
              className="w-[346px] h-[346px]"
                src={`https://svc.blockdaemon.com/nft/v1/ethereum/mainnet/media/${collection.logo}?apiKey=${API_KEY}`}
                alt="nft {index}"
              />
              <Card.Body>
                <Card.Title tag="h2" className="break-all">{collection.name}</Card.Title>
                <p className="break-all">{collection.contracts.join(", ")}</p>
                <Card.Actions className="justify-end">
                  <Button color="primary">
                    {collection.verified ? "Verified" : "Unverified"}
                  </Button>
                </Card.Actions>
              </Card.Body>
            </Card>
          ))}
        </ul>
        )}

        <Button onClick={handleLoadMore} className="w-42 block mx-auto my-5" disabled={isLoading}>
              Load More
            </Button>
      </div>
    </QueryClientProvider>
  );
}
