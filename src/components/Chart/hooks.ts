import { select } from 'd3';
import { RefObject, useEffect, useRef } from 'react';

import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Point } from './types';

export const useD3 = <T extends SVGSVGElement = SVGSVGElement>(
  renderChartFn: (selection: ReturnType<typeof select>) => void,
  dependencies: Array<any>,
): RefObject<T> => {
  const ref = useRef();

  useEffect(() => {
    renderChartFn(select(ref.current) as ReturnType<typeof select>);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
};

type UsePriceGraph = (props: {
  baseSpotPrice: number;
  rawDelta: number;
  rawFee: number;
  bondingCurve: BondingCurveType;
  buyOrdersAmount?: number;
  nftsCount: number;
  mathCounter?: number;
  type: string;
}) => Point[] | null;

export const usePriceGraph: UsePriceGraph = ({
  baseSpotPrice,
  rawDelta,
  rawFee = 0,
  bondingCurve,
  buyOrdersAmount = 0,
  nftsCount = 0,
  mathCounter = 0,
  type,
}) => {
  if (!bondingCurve || !baseSpotPrice) return null;

  const { array: priceArrayBuy } = helpers.calculatePricesArray({
    starting_spot_price: baseSpotPrice,
    delta: rawDelta,
    amount: buyOrdersAmount,
    bondingCurveType: bondingCurve,
    orderType: OrderType.Sell,
    counter: mathCounter + 1,
  }) as { array: number[]; total: number };

  const { array: priceArraySell } = helpers.calculatePricesArray({
    starting_spot_price: baseSpotPrice,
    delta: rawDelta,
    amount: nftsCount,
    bondingCurveType: bondingCurve,
    orderType: OrderType.Buy,
    counter: mathCounter,
  }) as { array: number[]; total: number };

  const pointsBuy = priceArrayBuy.map((price, i) => {
    const newPrice = price / 1e9;
    return {
      order: 1 + i,
      price: newPrice - newPrice * (rawFee / 10000),
      type: 'buy',
    };
  }) as Point[];

  const pointsSell = priceArraySell.map((price, i) => {
    const newPrice = price / 1e9;
    return {
      order: 1 + i,
      price: newPrice + newPrice * (rawFee / 10000),
      type: 'sell',
    };
  }) as Point[];

  const pointsArr =
    type === PairType.TokenForNFT
      ? [...pointsBuy, ...pointsSell]
      : [...pointsBuy.reverse(), ...pointsSell];

  return pointsArr;
};
