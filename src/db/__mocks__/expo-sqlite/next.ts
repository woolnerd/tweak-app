export const openDatabaseSync = jest.fn(() => ({
  transaction: jest.fn((callback) => {
    const tx = {
      executeSql: jest.fn((query, params, successCallback, errorCallback) => {
        if (successCallback) {
          successCallback({
            rows: {
              length: 0,
              item: jest.fn(),
              _array: [],
            },
          });
        }
      }),
    };
    callback(tx);
  }),
}));

export const prepareSync = jest.fn();
