import { useCallback, useEffect, useState } from 'react';

import { useOkapiKy } from '@folio/stripes/core';
import { chunk } from 'lodash';
import { useQueries } from 'react-query';

const USERS_ENDPOINT = 'users';

const useChunkedUsers = (userIdsArray, passedQueryOptions = {}) => {
  const { enabled = true, queryOptions } = passedQueryOptions;

  const ky = useOkapiKy();

  const CONCURRENT_REQUESTS = 5; // Number of requests to make concurrently
  const STEP_SIZE = 60; // Number of ids to request for per concurrent request

  const chunkedUsers = chunk(userIdsArray, STEP_SIZE);
  // chunkedItems will be an array of arrays of size CONCURRENT_REQUESTS * STEP_SIZE
  // We need to parallelise CONCURRENT_REQUESTS at a time,
  // and ensure we only fire the next lot once the previous lot are through

  const [isLoading, setIsLoading] = useState(userIdsArray?.length > 0);

  // Set up query array, and only enable the first CONCURRENT_REQUESTS requests
  const getQueryArray = useCallback(() => {
    const queryArray = [];
    chunkedUsers.forEach((chunkedItem, chunkedItemIndex) => {
      const query = chunkedItem.map(item => `id==${item}`).join(' or ');
      queryArray.push({
        queryKey: [USERS_ENDPOINT, chunkedItem],
        queryFn: () => ky.get(`${USERS_ENDPOINT}?limit=1000&query=${query}`).json(),
        // Only enable once the previous slice has all been fetched
        enabled: enabled && chunkedItemIndex < CONCURRENT_REQUESTS,
        ...queryOptions
      });
    });

    return queryArray;
  }, [chunkedUsers, enabled, ky, queryOptions]);

  const userQueries = useQueries(getQueryArray());

  // Once chunk has finished fetching, fetch next chunk
  useEffect(() => {
    const chunkedUserQuery = chunk(userQueries, CONCURRENT_REQUESTS);
    chunkedUserQuery.forEach((cuq, i) => {
      // Check that all previous chunk are fetched,
      // and that all of our current chunk are not fetched and not loading
      if (
        i !== 0 &&
        chunkedUserQuery[i - 1]?.every(pcuq => pcuq.isFetched === true) &&
        cuq.every(req => req.isFetched === false) &&
        cuq.every(req => req.isLoading === false)
      ) {
        // Trigger fetch for each request in the chunk
        cuq.forEach(req => {
          req.refetch();
        });
      }
    });
  }, [userQueries]);

  // Keep easy track of whether this hook is all loaded or not
  // (This slightly flattens the "isLoading/isFetched" distinction, but it's an ease of use prop)
  useEffect(() => {
    const newLoading = userIdsArray?.length > 0 && (!userQueries?.length || userQueries?.some(cuq => !cuq.isFetched));

    if (isLoading !== newLoading) {
      setIsLoading(newLoading);
    }
  }, [isLoading, userQueries, userIdsArray?.length]);


  return {
    userQueries,
    isLoading,
    // Offer all fetched orderLines in flattened array once ready
    users: isLoading ? [] : userQueries.reduce((acc, curr) => {
      return [...acc, ...(curr?.data?.users ?? [])];
    }, [])
  };
};

export default useChunkedUsers;
