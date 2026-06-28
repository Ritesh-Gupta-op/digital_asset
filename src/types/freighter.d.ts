declare global {
  interface Window {
    freighter?: {
      isAllowed: () => Promise<boolean>;
      requestAccess: () => Promise<{ error?: string }>;
      getPublicKey: () => Promise<string>;
      signTransaction: (txXdr: string, opts?: { networkPassphrase?: string }) => Promise<string>;
      signAuthEntry: (authEntry: string) => Promise<string>;
    };
    freighterApi?: {
      isAllowed: () => Promise<boolean>;
      requestAccess: () => Promise<{ error?: string }>;
      getPublicKey: () => Promise<string>;
      signTransaction: (txXdr: string, opts?: { networkPassphrase?: string }) => Promise<string>;
      signAuthEntry: (authEntry: string) => Promise<string>;
    };
  }
}

export {};