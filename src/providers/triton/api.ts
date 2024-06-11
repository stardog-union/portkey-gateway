import { ProviderAPIConfig } from '../types';

const TritonAPIConfig: ProviderAPIConfig = {
  headers: () => {
    return {};
  },
  getBaseURL: ({ providerOptions }) => {
    return providerOptions.customHost ?? '';
  },
  getEndpoint: ({ fn, providerOptions }) => {
    let mappedFn = fn;
    switch (mappedFn) {
      case 'complete': {
        // console.log("inside complete")
        return `/generate`;
      }
      default:
        return '';
    }
  },
};

export default TritonAPIConfig;
