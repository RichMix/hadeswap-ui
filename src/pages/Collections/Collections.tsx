import React, { FC, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, Row, Col, Button, Input } from 'antd';

import { AppLayout } from '../../components/Layout/AppLayout';
import { CollectionsList } from './components/CollectionsList';
import { CollectionsList as CollectionsListMobile } from './components/mobile/CollectionsList';
import SortingModal from './components/mobile/SortingModal';
import { SORT_ORDER } from './Collections.constants';

import { coreActions } from '../../state/core/actions';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../state/core/selectors';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';
import { MarketInfo } from '../../state/core/types';
import { TABLET } from '../../constants/common';
import { Spinner } from '../../components/Spinner/Spinner';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounce } from '../../hooks';
import { COLLECTION_TABS, createCollectionLink } from '../../constants';
import { specifyAndSort } from '../../utils';
import styles from './Collections.module.scss';

const { Title } = Typography;

export const Collections: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [searchStr, setSearchStr] = useState<string>('');
  const [sortValue, setSortValue] = useState<string | null>(null);
  const [collections, setCollections] = useState<MarketInfo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const screenMode = useSelector(selectScreeMode) as ScreenTypes;
  const markets = useSelector(selectAllMarkets) as MarketInfo[];
  const collectionsLoading = useSelector(selectAllMarketsLoading) as boolean;

  const isMobile = screenMode === TABLET;

  const setSearch = useDebounce((search: string): void => {
    setSearchStr(search.toUpperCase());
  }, 300);

  const onRowClick = useCallback(
    (data: string): void => {
      history.push(createCollectionLink(COLLECTION_TABS.BUY, data));
      window.scrollTo(0, 0);
    },
    [history],
  );

  const handleSort = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (sortValue !== e.currentTarget.dataset.value) {
        setSortValue(e.currentTarget.dataset.value);
      } else {
        setSortValue(null);
      }
    },
    [sortValue],
  );

  const filterCollections = (): MarketInfo[] => {
    return markets.filter(({ collectionName }) =>
      collectionName?.toUpperCase()?.includes(searchStr),
    );
  };

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCollections(filterCollections());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStr, markets]);

  useEffect(() => {
    if (sortValue) {
      const [name, order] = sortValue.split('_');
      const sorted = collections.sort((a, b) =>
        specifyAndSort(a[name], b[name]),
      );

      if (order === SORT_ORDER.DESC) {
        setCollections(sorted.reverse());
      } else {
        setCollections(sorted);
      }
    } else {
      setCollections(filterCollections());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortValue, collections]);

  return (
    <AppLayout>
      {isMobile && isModalVisible && (
        <SortingModal
          setIsModalVisible={setIsModalVisible}
          handleSort={handleSort}
          sortValue={sortValue}
        />
      )}
      <Row justify="center">
        <Col>
          <Title>collections</Title>
        </Col>
      </Row>
      {collectionsLoading ? (
        <Spinner />
      ) : (
        <>
          <Row justify="center">
            <Col>
              <Button
                style={{ marginBottom: '20px' }}
                type="primary"
                size="large"
                onClick={() => {
                  history.push('/create-pool');
                }}
              >
                + create pool
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={styles.tableWrapper}>
                <div className={styles.controlsWrapper}>
                  <Input
                    size="large"
                    placeholder="search by collection name"
                    prefix={<SearchOutlined />}
                    className={styles.searchInput}
                    onChange={(event) => setSearch(event.target.value || '')}
                  />
                  {isMobile && (
                    <div
                      className={styles.sortingBtn}
                      onClick={() => setIsModalVisible(true)}
                    >
                      sorting
                    </div>
                  )}
                </div>
                {isMobile ? (
                  <CollectionsListMobile
                    data={collections}
                    onRowClick={onRowClick}
                  />
                ) : (
                  <CollectionsList data={collections} onRowClick={onRowClick} />
                )}
              </div>
            </Col>
          </Row>
        </>
      )}
    </AppLayout>
  );
};
