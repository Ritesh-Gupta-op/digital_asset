declare global {
  interface Window {
    freighter: {
      isAllowed: () => Promise<boolean>;
      getPublicKey: () => Promise<string>;
      signTransaction: (txXdr: string, opts?: { networkPassphrase?: string }) => Promise<string>;
      signAuthEntry: (authEntry: string) => Promise<string>;
    };
  }
}

export {};
