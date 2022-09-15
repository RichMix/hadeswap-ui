import { createReducer } from 'typesafe-actions';
import { Dictionary, clone } from 'lodash';
import { coreActions, coreTypes } from '../actions';
import { CartOrder, CartPair, OrderType } from '../types';
import {
  calcNextSpotPrice,
  changePairOnOrderAdd,
  changePairOnOrderRemove,
  computeNewCartStateAfterBuyOrderRemove,
  computeNewCartStateAfterSellOrderRemove,
  findCartOrder,
  findInvalidBuyOrders,
  findInvalidSellOrders,
  findSellOrders,
  findValidOrders,
} from '../helpers';

export type CartState = {
  pairs: Dictionary<CartPair>;
  pendingOrders: Dictionary<CartOrder[]>;
  invalidOrders: Dictionary<CartOrder[]>;
  finishedOrdersMints: string[];
};

const initialCartState: CartState = {
  pairs: {},
  pendingOrders: {},
  invalidOrders: {},
  finishedOrdersMints: [],
};

const removeInvalidMintsFromCartPair = (
  pair: CartPair,
  invalidOrders: CartOrder[],
) => {
  const invalidMints = invalidOrders.map(({ mint }) => mint);
  const takenMints =
    pair?.takenMints.filter((mint) => !invalidMints.includes(mint)) || [];

  return { ...pair, takenMints };
};

export const cartReducer = createReducer<CartState>(initialCartState, {
  [coreTypes.UPDATE_PAIRS]: (
    state,
    { payload: pairsUpdates }: ReturnType<typeof coreActions.updatePairs>,
  ) => {
    const nextState = clone(state);

    pairsUpdates.forEach((pairUpdate) => {
      const affectedPair = state.pairs[pairUpdate.pairPubkey];

      if (!affectedPair) {
        return;
      }

      const oldOrders = nextState.pendingOrders[pairUpdate.pairPubkey] || [];

      //? Find invalid orders
      const invalidBuyOrders = findInvalidBuyOrders(pairUpdate, oldOrders);
      const invalidSellOrders = findInvalidSellOrders(pairUpdate, oldOrders);
      const allInvalidOrders = [...invalidBuyOrders, ...invalidSellOrders];

      //? Set invalid orders in store
      nextState.invalidOrders[pairUpdate.pairPubkey] = [
        ...(nextState.invalidOrders[pairUpdate.pairPubkey] || []),
        ...allInvalidOrders,
      ];

      //? Get valid orders
      const validOrders = findValidOrders(oldOrders, allInvalidOrders);
      const validSellOrders = findSellOrders(validOrders);

      //? Remove invalid orders from taken mints
      const pairWithValidOrders = removeInvalidMintsFromCartPair(
        affectedPair,
        allInvalidOrders,
      );

      //? Loop that creates new orders and pair
      const mutablePair = {
        ...pairWithValidOrders,
        spotPrice: pairUpdate.spotPrice,
        buyOrdersAmount: pairUpdate.buyOrdersAmount - validSellOrders.length,
      };
      const changedOrders = [];
      for (let i = 0; i < validOrders.length; ++i) {
        const order = validOrders[i];
        const isBuyOrder = order.type === OrderType.BUY;
        const nextSpotPrice = calcNextSpotPrice(mutablePair, order.type);
        const changedOrder = {
          ...order,
          price: isBuyOrder ? nextSpotPrice : mutablePair.spotPrice,
        };
        changedOrders.push(changedOrder);

        mutablePair.spotPrice = nextSpotPrice;
      }

      nextState.pairs[pairUpdate.pairPubkey] = mutablePair;
      nextState.pendingOrders[pairUpdate.pairPubkey] = changedOrders;
    });

    return nextState;
  },
  [coreTypes.CLEAR_INVALID_ORDERS]: (state) => {
    return {
      ...state,
      invalidOrders: {},
    };
  },
  [coreTypes.ADD_ORDER_TO_CART]: (
    state,
    { payload }: ReturnType<typeof coreActions.addOrderToCart>,
  ) => {
    const { pair: payloadPair, order: payloadOrder, orderType } = payload;
    const isBuyOrder = orderType === OrderType.BUY;

    const affectedPair: CartPair = state.pairs?.[payloadPair.pairPubkey] || {
      ...payloadPair,
      takenMints: [],
    };

    const nextSpotPrice = calcNextSpotPrice(affectedPair, orderType);

    const appendableOrder: CartOrder = {
      type: orderType,
      targetPairPukey: affectedPair.pairPubkey,
      price: isBuyOrder ? nextSpotPrice : affectedPair.spotPrice,

      mint: payloadOrder.mint,
      imageUrl: payloadOrder.imageUrl,
      name: payloadOrder.name,
      traits: payloadOrder.traits,
      collectionName: payloadOrder.collectionName,
      market: payloadOrder.market,

      nftPairBox: isBuyOrder ? payloadOrder.nftPairBox : null,
      vaultTokenAccount: isBuyOrder ? payloadOrder.vaultTokenAccount : null,
      nftValidationAdapter: !isBuyOrder
        ? payloadOrder.nftValidationAdapter
        : null,
    };

    const affectedPairAfterChanges: CartPair = changePairOnOrderAdd(
      affectedPair,
      appendableOrder,
    );

    return {
      ...state,
      pairs: {
        ...state.pairs,
        [affectedPairAfterChanges.pairPubkey]: affectedPairAfterChanges,
      },
      pendingOrders: {
        ...state.pendingOrders,
        [affectedPairAfterChanges.pairPubkey]: [
          ...(state.pendingOrders[affectedPairAfterChanges.pairPubkey] || []),
          appendableOrder,
        ],
      },
    };
  },
  [coreTypes.REMOVE_ORDER_FROM_CART]: (
    state,
    { payload }: ReturnType<typeof coreActions.removeOrderFromCart>,
  ) => {
    const { mint: removableMint } = payload;

    const removableOrder = findCartOrder(removableMint, state.pendingOrders);

    const { type: orderType, targetPairPukey: cartPairPubkey } = removableOrder;
    const isBuyOrder = orderType === OrderType.BUY;

    const affectedPair = state.pairs[cartPairPubkey];

    const affectedPairAfterChanges = changePairOnOrderRemove(
      affectedPair,
      removableOrder,
    );

    if (!isBuyOrder) {
      return computeNewCartStateAfterSellOrderRemove(
        state,
        affectedPairAfterChanges,
        removableOrder,
      );
    }

    return computeNewCartStateAfterBuyOrderRemove(
      state,
      affectedPairAfterChanges,
      removableOrder,
    );
  },
  [coreTypes.ADD_FINISHED_ORDER_MINT]: (
    state,
    { payload }: ReturnType<typeof coreActions.addFinishedOrderMint>,
  ) => {
    return {
      ...state,
      finishedOrdersMints: [...state.finishedOrdersMints, payload.mint],
    };
  },
});
