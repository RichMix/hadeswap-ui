import { FC, useEffect } from 'react';

import { CollectionPageLayout } from './CollectionPageLayout';
import styles from './Collection.module.scss';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllSellOrdersForMarket,
  selectMarketWalletNfts,
} from '../../state/core/selectors';
import { useWallet } from '@solana/wallet-adapter-react';
import { coreActions } from '../../state/core/actions';
import { useParams } from 'react-router-dom';

export const CollectionBuy: FC = () => {
  const orders = useSelector(selectAllSellOrdersForMarket);

  return (
    <CollectionPageLayout>
      <div className={styles.cards}>
        {orders.map((order) => (
          <NFTCard
            key={order.mint}
            imageUrl={order.imageUrl}
            name={order.name}
            price={order.price}
          />
        ))}
      </div>
    </CollectionPageLayout>
  );
};

export const CollectionSell: FC = () => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { connected } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    connected && marketPublicKey && dispatch(coreActions.fetchWalletNfts());
  }, [dispatch, connected, marketPublicKey]);

  const walletNfts = useSelector((state: never) =>
    selectMarketWalletNfts(state, marketPublicKey),
  );

  return (
    <CollectionPageLayout>
      <div className={styles.cards}>
        {walletNfts.map((nft) => (
          <NFTCard
            key={nft.mint}
            imageUrl={nft.imageUrl}
            name={nft.name}
            price={nft.price}
          />
        ))}
      </div>
    </CollectionPageLayout>
  );
};
