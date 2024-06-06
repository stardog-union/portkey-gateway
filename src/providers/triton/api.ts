import { ProviderAPIConfig } from '../types';

const TritonAPIConfig: ProviderAPIConfig = {
  headers: () => {
    return {};
  },
  getBaseURL: ({ providerOptions }) => {
    console.log('getBaseURL', providerOptions.customHost);
    return providerOptions.customHost ?? '';
  },
  getEndpoint: ({ fn, providerOptions }) => {
    let mappedFn = fn;
    const { urlToFetch } = providerOptions;
    console.log(`mappedFn: ${mappedFn}`);
    switch (mappedFn) {
      case 'complete': {
        console.log('insode complete');
        return `/generate`;
      }
      default:
        console.log('insode blank');
        return '';
    }
  },
};

export default TritonAPIConfig;
