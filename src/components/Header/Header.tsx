import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useWalletModalToggle } from 'state/application/hooks';
import {
  isTransactionRecent,
  useAllTransactions,
} from 'state/transactions/hooks';
import { TransactionDetails } from 'state/transactions/reducer';
import { shortenAddress, addMaticToMetamask, isSupportedNetwork } from 'utils';
import useENSName from 'hooks/useENSName';
import { WalletModal } from 'components';
import { useActiveWeb3React } from 'hooks';
import QuickIcon from 'assets/images/quickIcon.svg';
import QuickLogo from 'assets/images/quickLogo.png';
import { ReactComponent as ThreeDotIcon } from 'assets/images/ThreeDot.svg';
import { ReactComponent as LightIcon } from 'assets/images/LightIcon.svg';
import WalletIcon from 'assets/images/WalletIcon.png';
import 'components/styles/Header.scss';

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => {
  return b.addedTime - a.addedTime;
};

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const { account } = useActiveWeb3React();
  const { ethereum } = window as any;
  const { ENSName } = useENSName(account ?? undefined);
  const [openDetailMenu, setOpenDetailMenu] = useState(false);
  const theme = useTheme();
  const allTransactions = useAllTransactions();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx: any) => !tx.receipt)
    .map((tx: any) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx: any) => tx.receipt)
    .map((tx: any) => tx.hash);
  const tabletWindowSize = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileWindowSize = useMediaQuery(theme.breakpoints.down('xs'));
  const toggleWalletModal = useWalletModalToggle();
  const menuItems = [
    {
      link: '/swap',
      text: 'Swap',
      id: 'swap-page-link',
    },
    {
      link: '/pools',
      text: 'Pool',
      id: 'pools-page-link',
    },
    {
      link: '/farm',
      text: 'Farm',
      id: 'farm-page-link',
    },
    {
      link: '/dragons',
      text: 'Dragon’s Lair',
      id: 'dragons-page-link',
    },
    {
      link: '/convert',
      text: 'Convert',
      id: 'convert-quick',
    },
    {
      link: '/analytics',
      text: 'Analytics',
      id: 'analytics-page-link',
    },
  ];

  const outLinks: any[] = [
    // {
    //   link: '/',
    //   text: 'Governance',
    // },
    // {
    //   link: '/',
    //   text: 'Docs',
    // },
    // {
    //   link: '/',
    //   text: 'For Developers',
    // },
    // {
    //   link: '/',
    //   text: 'Help & Tutorials',
    // },
    // {
    //   link: '/',
    //   text: 'Knowledge Base',
    // },
    // {
    //   link: '/',
    //   text: 'News',
    // },
  ];

  return (
    <Box className='header'>
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
      <Link to='/'>
        <img
          src={mobileWindowSize ? QuickIcon : QuickLogo}
          alt='QuickLogo'
          height={60}
        />
      </Link>
      {!tabletWindowSize && (
        <Box className='mainMenu'>
          {menuItems.map((val, index) => (
            <Link
              to={val.link}
              key={index}
              id={val.id}
              className={
                pathname.indexOf(val.link) > -1 ? 'active' : 'menuItem'
              }
            >
              <small>{val.text}</small>
            </Link>
          ))}
          {/* <Box display='flex' className='menuItem'>
            <ThreeDotIcon />
            <Box
              position='absolute'
              top={32}
              left={0}
              width={209}
              paddingTop={10}
            >
              <Box className='subMenu'>
                {outLinks.map((item, ind) => (
                  <a href={item.link} key={ind}>
                    <small>{item.text}</small>
                  </a>
                ))}
              </Box>
            </Box>
          </Box> */}
        </Box>
      )}
      {tabletWindowSize && (
        <Box className='mobileMenuContainer'>
          <Box className='mobileMenu'>
            {menuItems.slice(0, 4).map((val, index) => (
              <Link
                to={val.link}
                key={index}
                className={
                  pathname.indexOf(val.link) > -1 ? 'active' : 'menuItem'
                }
              >
                <small>{val.text}</small>
              </Link>
            ))}
            <Box className='flex menuItem'>
              <ThreeDotIcon
                onClick={() => setOpenDetailMenu(!openDetailMenu)}
              />
              {openDetailMenu && (
                <Box className='subMenuWrapper'>
                  <Box className='subMenu'>
                    {menuItems.slice(4, menuItems.length).map((val, index) => (
                      <Link
                        to={val.link}
                        key={index}
                        className='menuItem'
                        onClick={() => setOpenDetailMenu(false)}
                      >
                        <small>{val.text}</small>
                      </Link>
                    ))}
                    {outLinks.map((item, ind) => (
                      <a
                        href={item.link}
                        key={ind}
                        onClick={() => setOpenDetailMenu(false)}
                      >
                        <small>{item.text}</small>
                      </a>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
      <Box>
        <Box className='headerIconWrapper'>
          <Box className='styledPollingDot' />
          <LightIcon />
        </Box>
        {account && (!ethereum || isSupportedNetwork(ethereum)) ? (
          <Box
            id='web3-status-connected'
            className='accountDetails'
            onClick={toggleWalletModal}
          >
            <p>{shortenAddress(account)}</p>
            <img src={WalletIcon} alt='Wallet' />
          </Box>
        ) : (
          <Box
            className={`connectButton ${
              ethereum && !isSupportedNetwork(ethereum)
                ? 'bg-error'
                : 'bg-primary'
            }`}
            onClick={() => {
              if (!ethereum || isSupportedNetwork(ethereum)) {
                toggleWalletModal();
              }
            }}
          >
            {ethereum && !isSupportedNetwork(ethereum)
              ? 'Wrong Network'
              : 'Connect Wallet'}
            {ethereum && !isSupportedNetwork(ethereum) && (
              <Box className='wrongNetworkWrapper'>
                <Box className='wrongNetworkContent'>
                  <small>Please switch your wallet to Polygon Network.</small>
                  <Box mt={2.5} onClick={addMaticToMetamask}>
                    Switch to Polygon
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
