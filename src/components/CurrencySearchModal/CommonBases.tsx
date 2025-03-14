import React from 'react';
import { ChainId, Currency, currencyEquals, ETHER, Token } from '@uniswap/sdk';
import { Box } from '@material-ui/core';
import { GlobalData } from 'constants/index';
import { CurrencyLogo, QuestionHelper } from 'components';

interface CommonBasesProps {
  chainId?: ChainId;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}

const CommonBases: React.FC<CommonBasesProps> = ({
  chainId,
  onSelect,
  selectedCurrency,
}) => {
  return (
    <Box mb={2}>
      <Box display='flex' my={1.5}>
        <Box mr='6px'>
          <span>Common bases</span>
        </Box>
        <QuestionHelper text='These tokens are commonly paired with other tokens.' />
      </Box>
      <Box className='flex flex-wrap'>
        <Box
          className='baseWrapper'
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER);
            }
          }}
        >
          <CurrencyLogo currency={ETHER} size='24px' />
          <small>MATIC</small>
        </Box>
        {(chainId ? GlobalData.bases.SUGGESTED_BASES[chainId] : []).map(
          (token: Token) => {
            const selected =
              selectedCurrency instanceof Token &&
              selectedCurrency.address === token.address;
            return (
              <Box
                className='baseWrapper'
                key={token.address}
                onClick={() => !selected && onSelect(token)}
              >
                <CurrencyLogo currency={token} size='24px' />
                <small>{token.symbol}</small>
              </Box>
            );
          },
        )}
      </Box>
    </Box>
  );
};

export default CommonBases;
