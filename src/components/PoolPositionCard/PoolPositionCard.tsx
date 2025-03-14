import React, { useEffect, useMemo, useState } from 'react';
import { Box, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Pair } from '@uniswap/sdk';
import { unwrappedToken } from 'utils/wrappedCurrency';
import {
  useStakingInfo,
  getBulkPairData,
  useDualStakingInfo,
} from 'state/stake/hooks';
import { DoubleCurrencyLogo } from 'components';
import { formatAPY, getAPYWithFee, getOneYearFee } from 'utils';
import PoolPositionCardDetails from './PoolPositionCardDetails';
import 'components/styles/PoolPositionCard.scss';

const PoolPositionCard: React.FC<{ pair: Pair }> = ({ pair }) => {
  const [bulkPairData, setBulkPairData] = useState<any>(null);
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('xs'));

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const stakingInfos = useStakingInfo(pair);
  const dualStakingInfos = useDualStakingInfo(pair);
  const stakingInfo = useMemo(
    () =>
      stakingInfos && stakingInfos.length > 0
        ? stakingInfos[0]
        : dualStakingInfos && dualStakingInfos.length > 0
        ? dualStakingInfos[0]
        : null,
    [stakingInfos, dualStakingInfos],
  );

  const pairId = pair.liquidityToken.address;

  useEffect(() => {
    const pairLists = [pairId];
    getBulkPairData(pairLists).then((data) => setBulkPairData(data));
    return () => setBulkPairData(null);
  }, [pairId]);

  const [showMore, setShowMore] = useState(false);

  const apyWithFee = useMemo(() => {
    if (stakingInfo && bulkPairData) {
      const dayVolume = bulkPairData[stakingInfo.pair]?.oneDayVolumeUSD;
      const reserveUSD = bulkPairData[stakingInfo.pair]?.reserveUSD;
      const oneYearFee =
        dayVolume && reserveUSD ? getOneYearFee(dayVolume, reserveUSD) : 0;
      return formatAPY(
        getAPYWithFee(stakingInfo.perMonthReturnInRewards ?? 0, oneYearFee),
      );
    }
  }, [stakingInfo, bulkPairData]);

  return (
    <Box
      width={1}
      borderRadius={10}
      className={`border-secondary2 ${
        showMore ? 'bg-secondary2' : 'bg-transparent'
      }`}
      overflow='hidden'
    >
      <Box
        px={isMobile ? 1.5 : 3}
        py={isMobile ? 2 : 3}
        className='flex items-center justify-between'
      >
        <Box className='flex items-center'>
          <DoubleCurrencyLogo
            currency0={currency0}
            currency1={currency1}
            size={28}
          />
          <p className='weight-600' style={{ marginLeft: 16 }}>
            {!currency0 || !currency1
              ? 'Loading'
              : `${currency0.symbol}/${currency1.symbol}`}
          </p>
        </Box>

        <Box
          className='flex items-center text-primary cursor-pointer'
          onClick={() => setShowMore(!showMore)}
        >
          <p style={{ marginRight: 8 }}>Manage</p>
          {showMore ? <ChevronUp size='20' /> : <ChevronDown size='20' />}
        </Box>
      </Box>

      {showMore && <PoolPositionCardDetails pair={pair} />}
      {stakingInfo && !stakingInfo.ended && apyWithFee && (
        <Box bgcolor='#404557' paddingY={0.75} paddingX={isMobile ? 2 : 3}>
          <small>
            Earn <small className='text-success'>{apyWithFee}% APY</small> by
            staking your LP tokens in {currency0.symbol?.toUpperCase()} /{' '}
            {currency1.symbol?.toUpperCase()} Farm
          </small>
        </Box>
      )}
    </Box>
  );
};

export default PoolPositionCard;
