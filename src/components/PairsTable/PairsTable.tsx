import React from 'react';
import { Box, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ChainId, Token } from '@uniswap/sdk';
import { getAddress } from '@ethersproject/address';
import { DoubleCurrencyLogo, CustomTable } from 'components';
import { GlobalConst } from 'constants/index';
import { useBookmarkPairs } from 'state/application/hooks';
import { ReactComponent as StarChecked } from 'assets/images/StarChecked.svg';
import { ReactComponent as StarUnchecked } from 'assets/images/StarUnchecked.svg';

interface TokensTableProps {
  data: any[];
}

const headCells = () => [
  {
    id: 'pairName',
    numeric: false,
    label: 'Name',
    sortKey: (pair: any) => pair.token0.symbol + ' ' + pair.token1.symbol,
  },
  {
    id: 'pairLiquidity',
    numeric: false,
    label: 'Liquidity',
    sortKey: (pair: any) =>
      pair.trackedReserveUSD ? pair.trackedReserveUSD : pair.reserveUSD,
  },
  {
    id: 'pairdayVolume',
    numeric: false,
    label: '24h Volume',
    sortKey: (pair: any) =>
      pair.oneDayVolumeUSD ? pair.oneDayVolumeUSD : pair.oneDayVolumeUntracked,
  },
  {
    id: 'pairweekVolume',
    numeric: false,
    label: '7d Volume',
    sortKey: (pair: any) =>
      pair.oneWeekVolumeUSD
        ? pair.oneWeekVolumeUSD
        : pair.oneWeekVolumeUntracked,
  },
  {
    id: 'pairdayFee',
    numeric: false,
    label: '24h Fees',
    align: 'right',
    sortKey: (pair: any) =>
      pair.oneDayVolumeUSD ? pair.oneDayVolumeUSD : pair.oneDayVolumeUntracked,
  },
];

const liquidityHeadCellIndex = 1;

const PairTable: React.FC<TokensTableProps> = ({ data }) => {
  const pairHeadCells = headCells();
  const {
    bookmarkPairs,
    addBookmarkPair,
    removeBookmarkPair,
  } = useBookmarkPairs();
  const mobileHTML = (pair: any, index: number) => {
    const token0 = new Token(
      ChainId.MATIC,
      getAddress(pair.token0.id),
      Number(pair.token0.decimals),
      pair.token0.symbol,
    );
    const token1 = new Token(
      ChainId.MATIC,
      getAddress(pair.token1.id),
      Number(pair.token1.decimals),
      pair.token1.symbol,
    );
    const liquidity = pair.trackedReserveUSD
      ? pair.trackedReserveUSD
      : pair.reserveUSD;
    const oneDayVolume = pair.oneDayVolumeUSD
      ? pair.oneDayVolumeUSD
      : pair.oneDayVolumeUntracked;
    const oneWeekVolume = pair.oneWeekVolumeUSD
      ? pair.oneWeekVolumeUSD
      : pair.oneWeekVolumeUntracked;
    const oneDayFee = (
      Number(oneDayVolume) * GlobalConst.utils.FEEPERCENT
    ).toLocaleString();
    return (
      <Box mt={index === 0 ? 0 : 3}>
        <Box className='flex items-center' mb={1}>
          <Box
            display='flex'
            mr={1}
            onClick={() => {
              const pairIndex = bookmarkPairs.indexOf(pair.id);
              if (pairIndex === -1) {
                addBookmarkPair(pair.id);
              } else {
                removeBookmarkPair(pair.id);
              }
            }}
          >
            {bookmarkPairs.indexOf(pair.id) > -1 ? (
              <StarChecked />
            ) : (
              <StarUnchecked />
            )}
          </Box>
          <Link className='no-decoration' to={`/analytics/pair/${pair.id}`}>
            <Box className='flex items-center'>
              <DoubleCurrencyLogo
                currency0={token0}
                currency1={token1}
                size={28}
              />
              <Box ml={1}>
                <p className='text-gray25'>
                  {token0.symbol} / {token1.symbol}
                </p>
              </Box>
            </Box>
          </Link>
        </Box>
        <Divider />
        <Box className='mobileRow'>
          <p>Liquidity</p>
          <p>${Number(liquidity).toLocaleString()}</p>
        </Box>
        <Box className='mobileRow'>
          <p>24h Volume</p>
          <p>${Number(oneDayVolume).toLocaleString()}</p>
        </Box>
        <Box className='mobileRow'>
          <p>7d Volume</p>
          <p>${Number(oneWeekVolume).toLocaleString()}</p>
        </Box>
        <Box className='mobileRow'>
          <p>24h Fees</p>
          <p>${oneDayFee}</p>
        </Box>
      </Box>
    );
  };

  const desktopHTML = (pair: any) => {
    const token0 = new Token(
      ChainId.MATIC,
      getAddress(pair.token0.id),
      Number(pair.token0.decimals),
      pair.token0.symbol,
    );
    const token1 = new Token(
      ChainId.MATIC,
      getAddress(pair.token1.id),
      Number(pair.token1.decimals),
      pair.token1.symbol,
    );
    const liquidity = pair.trackedReserveUSD
      ? pair.trackedReserveUSD
      : pair.reserveUSD;
    const oneDayVolume =
      pair.oneDayVolumeUSD && !isNaN(pair.oneDayVolumeUSD)
        ? pair.oneDayVolumeUSD
        : pair.oneDayVolumeUntracked && !isNaN(pair.oneDayVolumeUntracked)
        ? pair.oneDayVolumeUntracked
        : 0;
    const oneWeekVolume =
      pair.oneWeekVolumeUSD && !isNaN(pair.oneWeekVolumeUSD)
        ? pair.oneWeekVolumeUSD
        : pair.oneWeekVolumeUntracked && !isNaN(pair.oneWeekVolumeUntracked)
        ? pair.oneWeekVolumeUntracked
        : 0;
    const oneDayFee = (
      Number(oneDayVolume) * GlobalConst.utils.FEEPERCENT
    ).toLocaleString();
    return [
      {
        html: (
          <Box className='flex items-center'>
            <Box
              display='flex'
              mr={1}
              onClick={() => {
                const pairIndex = bookmarkPairs.indexOf(pair.id);
                if (pairIndex === -1) {
                  addBookmarkPair(pair.id);
                } else {
                  removeBookmarkPair(pair.id);
                }
              }}
            >
              {bookmarkPairs.indexOf(pair.id) > -1 ? (
                <StarChecked />
              ) : (
                <StarUnchecked />
              )}
            </Box>
            <Link className='no-decoration' to={`/analytics/pair/${pair.id}`}>
              <Box className='flex items-center'>
                <DoubleCurrencyLogo
                  currency0={token0}
                  currency1={token1}
                  size={28}
                />
                <Box ml={1}>
                  <p className='text-gray25'>
                    {token0.symbol} / {token1.symbol}
                  </p>
                </Box>
              </Box>
            </Link>
          </Box>
        ),
      },
      {
        html: <p>${Number(liquidity).toLocaleString()}</p>,
      },
      {
        html: <p>${Number(oneDayVolume).toLocaleString()}</p>,
      },
      {
        html: <p>${Number(oneWeekVolume).toLocaleString()}</p>,
      },
      {
        html: <p>${oneDayFee}</p>,
      },
    ];
  };

  return (
    <CustomTable
      defaultOrderBy={pairHeadCells[liquidityHeadCellIndex]}
      defaultOrder='desc'
      showPagination={data.length > GlobalConst.utils.ROWSPERPAGE}
      headCells={pairHeadCells}
      rowsPerPage={GlobalConst.utils.ROWSPERPAGE}
      data={data}
      mobileHTML={mobileHTML}
      desktopHTML={desktopHTML}
    />
  );
};

export default PairTable;
