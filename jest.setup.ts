// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  let mockCache: { [key: string]: string } = {};
  return {
    setItem: jest.fn((key: string, value: string) => {
      return new Promise<void>(resolve => {
        mockCache[key] = value;
        resolve();
      });
    }),
    getItem: jest.fn((key: string) => {
      return new Promise<string | null>(resolve => {
        resolve(mockCache[key] || null);
      });
    }),
    removeItem: jest.fn((key: string) => {
      return new Promise<void>(resolve => {
        delete mockCache[key];
        resolve();
      });
    }),
    clear: jest.fn(() => {
      return new Promise<void>(resolve => {
        mockCache = {};
        resolve();
      });
    }),
  };
});