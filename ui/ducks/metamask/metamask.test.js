import { TRANSACTION_STATUSES } from '../../../shared/constants/transaction';
import * as actionConstants from '../../store/actionConstants';
import reduceMetamask, {
  getBlockGasLimit,
  getConversionRate,
  getNativeCurrency,
  getSendHexDataFeatureFlagState,
  getSendToAccounts,
  getUnapprovedTxs,
} from './metamask';

describe('MetaMask Reducers', () => {
  const mockState = {
    metamask: reduceMetamask(
      {
        isInitialized: true,
        isUnlocked: true,
        featureFlags: { sendHexData: true },
        identities: {
          '0xfdea65c8e26263f6d9a1b5de9555d2931a33b825': {
            address: '0xfdea65c8e26263f6d9a1b5de9555d2931a33b825',
            name: 'Send Account 1',
          },
          '0xc5b8dbac4c1d3f152cdeb400e2313f309c410acb': {
            address: '0xc5b8dbac4c1d3f152cdeb400e2313f309c410acb',
            name: 'Send Account 2',
          },
          '0x2f8d4a878cfa04a6e60d46362f5644deab66572d': {
            address: '0x2f8d4a878cfa04a6e60d46362f5644deab66572d',
            name: 'Send Account 3',
          },
          '0xd85a4b6a394794842887b8284293d69163007bbb': {
            address: '0xd85a4b6a394794842887b8284293d69163007bbb',
            name: 'Send Account 4',
          },
        },
        cachedBalances: {},
        currentBlockGasLimit: '0x4c1878',
        conversionRate: 1200.88200327,
        nativeCurrency: 'ETH',
        network: '3',
        provider: {
          type: 'testnet',
          chainId: '0x3',
        },
        accounts: {
          '0xfdea65c8e26263f6d9a1b5de9555d2931a33b825': {
            code: '0x',
            balance: '0x47c9d71831c76efe',
            nonce: '0x1b',
            address: '0xfdea65c8e26263f6d9a1b5de9555d2931a33b825',
          },
          '0xc5b8dbac4c1d3f152cdeb400e2313f309c410acb': {
            code: '0x',
            balance: '0x37452b1315889f80',
            nonce: '0xa',
            address: '0xc5b8dbac4c1d3f152cdeb400e2313f309c410acb',
          },
          '0x2f8d4a878cfa04a6e60d46362f5644deab66572d': {
            code: '0x',
            balance: '0x30c9d71831c76efe',
            nonce: '0x1c',
            address: '0x2f8d4a878cfa04a6e60d46362f5644deab66572d',
          },
          '0xd85a4b6a394794842887b8284293d69163007bbb': {
            code: '0x',
            balance: '0x0',
            nonce: '0x0',
            address: '0xd85a4b6a394794842887b8284293d69163007bbb',
          },
        },
        addressBook: {
          '0x3': {
            '0x06195827297c7a80a443b6894d3bdb8824b43896': {
              address: '0x06195827297c7a80a443b6894d3bdb8824b43896',
              name: 'Address Book Account 1',
              chainId: '0x3',
            },
          },
        },
        unapprovedTxs: {
          4768706228115573: {
            id: 4768706228115573,
            time: 1487363153561,
            status: TRANSACTION_STATUSES.UNAPPROVED,
            gasMultiplier: 1,
            metamaskNetworkId: '3',
            txParams: {
              from: '0xc5b8dbac4c1d3f152cdeb400e2313f309c410acb',
              to: '0x18a3462427bcc9133bb46e88bcbe39cd7ef0e761',
              value: '0xde0b6b3a7640000',
              metamaskId: 4768706228115573,
              metamaskNetworkId: '3',
              gas: '0x5209',
            },
            txFee: '17e0186e60800',
            txValue: 'de0b6b3a7640000',
            maxCost: 'de234b52e4a0800',
            gasPrice: '4a817c800',
          },
        },
      },
      {},
    ),
  };
  it('init state', () => {
    const initState = reduceMetamask(undefined, {});

    expect.anything(initState);
  });

  it('locks MetaMask', () => {
    const unlockMetaMaskState = {
      isUnlocked: true,
      selectedAddress: 'test address',
    };
    const lockMetaMask = reduceMetamask(unlockMetaMaskState, {
      type: actionConstants.LOCK_METAMASK,
    });

    expect(lockMetaMask.isUnlocked).toStrictEqual(false);
  });

  it('sets rpc target', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.SET_RPC_TARGET,
        value: 'https://custom.rpc',
      },
    );

    expect(state.provider.rpcUrl).toStrictEqual('https://custom.rpc');
  });

  it('sets provider type', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.SET_PROVIDER_TYPE,
        value: 'provider type',
      },
    );

    expect(state.provider.type).toStrictEqual('provider type');
  });

  it('shows account detail', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.SHOW_ACCOUNT_DETAIL,
        value: 'test address',
      },
    );

    expect(state.isUnlocked).toStrictEqual(true);
    expect(state.isInitialized).toStrictEqual(true);
    expect(state.selectedAddress).toStrictEqual('test address');
  });

  it('sets account label', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.SET_ACCOUNT_LABEL,
        value: {
          account: 'test account',
          label: 'test label',
        },
      },
    );

    expect(state.identities).toStrictEqual({
      'test account': { name: 'test label' },
    });
  });

  it('updates tokens', () => {
    const newTokens = {
      address: '0x617b3f8050a0bd94b6b1da02b4384ee5b4df13f4',
      decimals: 18,
      symbol: 'META',
    };

    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_TOKENS,
        newTokens,
      },
    );

    expect(state.tokens).toStrictEqual(newTokens);
  });

  it('updates send gas limit', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_GAS_LIMIT,
        value: '0xGasLimit',
      },
    );

    expect(state.send.gasLimit).toStrictEqual('0xGasLimit');
  });

  it('updates send gas price', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_GAS_PRICE,
        value: '0xGasPrice',
      },
    );

    expect(state.send.gasPrice).toStrictEqual('0xGasPrice');
  });

  it('toggles account menu', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.TOGGLE_ACCOUNT_MENU,
      },
    );

    expect(state.isAccountMenuOpen).toStrictEqual(true);
  });

  it('updates gas total', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_GAS_TOTAL,
        value: '0xGasTotal',
      },
    );

    expect(state.send.gasTotal).toStrictEqual('0xGasTotal');
  });

  it('updates send token balance', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_SEND_TOKEN_BALANCE,
        value: '0xTokenBalance',
      },
    );

    expect(state.send.tokenBalance).toStrictEqual('0xTokenBalance');
  });

  it('updates data', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_SEND_HEX_DATA,
        value: '0xData',
      },
    );

    expect(state.send.data).toStrictEqual('0xData');
  });

  it('updates send to', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_SEND_TO,
        value: {
          to: '0xAddress',
          nickname: 'nickname',
        },
      },
    );

    expect(state.send.to).toStrictEqual('0xAddress');
    expect(state.send.toNickname).toStrictEqual('nickname');
  });

  it('update send amount', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_SEND_AMOUNT,
        value: '0xAmount',
      },
    );

    expect(state.send.amount).toStrictEqual('0xAmount');
  });

  it('updates max mode', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_MAX_MODE,
        value: true,
      },
    );

    expect(state.send.maxModeOn).toStrictEqual(true);
  });

  it('update send', () => {
    const value = {
      gasLimit: '0xGasLimit',
      gasPrice: '0xGasPrice',
      gasTotal: '0xGasTotal',
      tokenBalance: '0xBalance',
      from: '0xAddress',
      to: '0xAddress',
      toNickname: '',
      maxModeOn: false,
      amount: '0xAmount',
      memo: '0xMemo',
      errors: {},
      editingTransactionId: 22,
      ensResolution: null,
      ensResolutionError: '',
    };

    const sendState = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_SEND,
        value,
      },
    );

    expect(sendState.send).toStrictEqual(value);
  });

  it('clears send', () => {
    const initStateSend = {
      send: {
        gasLimit: null,
        gasPrice: null,
        gasTotal: null,
        tokenBalance: null,
        from: '',
        to: '',
        amount: '0x0',
        memo: '',
        errors: {},
        maxModeOn: false,
        editingTransactionId: null,
        toNickname: '',
      },
    };

    const sendState = {
      send: {
        gasLimit: '0xGasLimit',
        gasPrice: '0xGasPrice',
        gasTotal: '0xGasTotal',
        tokenBalance: '0xBalance',
        from: '0xAddress',
        to: '0xAddress',
        toNickname: '',
        maxModeOn: false,
        amount: '0xAmount',
        memo: '0xMemo',
        errors: {},
        editingTransactionId: 22,
      },
    };

    const state = reduceMetamask(sendState, {
      type: actionConstants.CLEAR_SEND,
    });

    expect(state.send).toStrictEqual(initStateSend.send);
  });

  it('updates value of tx by id', () => {
    const oldState = {
      currentNetworkTxList: [
        {
          id: 1,
          txParams: 'foo',
        },
      ],
    };

    const state = reduceMetamask(oldState, {
      type: actionConstants.UPDATE_TRANSACTION_PARAMS,
      id: 1,
      value: 'bar',
    });

    expect(state.currentNetworkTxList[0].txParams).toStrictEqual('bar');
  });

  it('sets blockies', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.SET_USE_BLOCKIE,
        value: true,
      },
    );

    expect(state.useBlockie).toStrictEqual(true);
  });

  it('updates an arbitrary feature flag', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_FEATURE_FLAGS,
        value: {
          foo: true,
        },
      },
    );

    expect(state.featureFlags.foo).toStrictEqual(true);
  });

  it('close welcome screen', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.CLOSE_WELCOME_SCREEN,
      },
    );

    expect(state.welcomeScreenSeen).toStrictEqual(true);
  });

  it('sets current locale', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.SET_CURRENT_LOCALE,
        value: { locale: 'ge' },
      },
    );

    expect(state.currentLocale).toStrictEqual('ge');
  });

  it('sets pending tokens', () => {
    const payload = {
      address: '0x617b3f8050a0bd94b6b1da02b4384ee5b4df13f4',
      decimals: 18,
      symbol: 'META',
    };

    const pendingTokensState = reduceMetamask(
      {},
      {
        type: actionConstants.SET_PENDING_TOKENS,
        payload,
      },
    );

    expect(pendingTokensState.pendingTokens).toStrictEqual(payload);
  });

  it('clears pending tokens', () => {
    const payload = {
      address: '0x617b3f8050a0bd94b6b1da02b4384ee5b4df13f4',
      decimals: 18,
      symbol: 'META',
    };

    const pendingTokensState = {
      pendingTokens: payload,
    };

    const state = reduceMetamask(pendingTokensState, {
      type: actionConstants.CLEAR_PENDING_TOKENS,
    });

    expect(state.pendingTokens).toStrictEqual({});
  });

  it('update ensResolution', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_SEND_ENS_RESOLUTION,
        payload: '0x1337',
      },
    );

    expect(state.send.ensResolution).toStrictEqual('0x1337');
    expect(state.send.ensResolutionError).toStrictEqual('');
  });

  it('update ensResolutionError', () => {
    const state = reduceMetamask(
      {},
      {
        type: actionConstants.UPDATE_SEND_ENS_RESOLUTION_ERROR,
        payload: 'ens name not found',
      },
    );

    expect(state.send.ensResolutionError).toStrictEqual('ens name not found');
    expect(state.send.ensResolution).toBeNull();
  });

  describe('metamask state selectors', () => {
    describe('getBlockGasLimit', () => {
      it('should return the current block gas limit', () => {
        expect(getBlockGasLimit(mockState)).toStrictEqual('0x4c1878');
      });
    });

    describe('getConversionRate()', () => {
      it('should return the eth conversion rate', () => {
        expect(getConversionRate(mockState)).toStrictEqual(1200.88200327);
      });
    });

    describe('getNativeCurrency()', () => {
      it('should return the ticker symbol of the selected network', () => {
        expect(getNativeCurrency(mockState)).toStrictEqual('ETH');
      });
    });

    describe('getSendHexDataFeatureFlagState()', () => {
      it('should return the sendHexData feature flag state', () => {
        expect(getSendHexDataFeatureFlagState(mockState)).toStrictEqual(true);
      });
    });

    describe('getSendToAccounts()', () => {
      it('should return an array including all the users accounts and the address book', () => {
        expect(getSendToAccounts(mockState)).toStrictEqual([
          {
            code: '0x',
            balance: '0x47c9d71831c76efe',
            nonce: '0x1b',
            address: '0xfdea65c8e26263f6d9a1b5de9555d2931a33b825',
            name: 'Send Account 1',
          },
          {
            code: '0x',
            balance: '0x37452b1315889f80',
            nonce: '0xa',
            address: '0xc5b8dbac4c1d3f152cdeb400e2313f309c410acb',
            name: 'Send Account 2',
          },
          {
            code: '0x',
            balance: '0x30c9d71831c76efe',
            nonce: '0x1c',
            address: '0x2f8d4a878cfa04a6e60d46362f5644deab66572d',
            name: 'Send Account 3',
          },
          {
            code: '0x',
            balance: '0x0',
            nonce: '0x0',
            address: '0xd85a4b6a394794842887b8284293d69163007bbb',
            name: 'Send Account 4',
          },
          {
            address: '0x06195827297c7a80a443b6894d3bdb8824b43896',
            name: 'Address Book Account 1',
            chainId: '0x3',
          },
        ]);
      });
    });

    it('should return the unapproved txs', () => {
      expect(getUnapprovedTxs(mockState)).toStrictEqual({
        4768706228115573: {
          id: 4768706228115573,
          time: 1487363153561,
          status: TRANSACTION_STATUSES.UNAPPROVED,
          gasMultiplier: 1,
          metamaskNetworkId: '3',
          txParams: {
            from: '0xc5b8dbac4c1d3f152cdeb400e2313f309c410acb',
            to: '0x18a3462427bcc9133bb46e88bcbe39cd7ef0e761',
            value: '0xde0b6b3a7640000',
            metamaskId: 4768706228115573,
            metamaskNetworkId: '3',
            gas: '0x5209',
          },
          txFee: '17e0186e60800',
          txValue: 'de0b6b3a7640000',
          maxCost: 'de234b52e4a0800',
          gasPrice: '4a817c800',
        },
      });
    });
  });
});
