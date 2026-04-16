type WalletListItem = {
  name: string;
  type?: string;
  address?: string;
  balance?: string | number;
  currency?: string;
};

const useWalletListAPI = () => {
  return {
    request: {
      data: {
        data: [] as WalletListItem[],
      },
      isLoading: false,
      error: undefined,
    },
  };
};

export type { WalletListItem };
export default useWalletListAPI;
