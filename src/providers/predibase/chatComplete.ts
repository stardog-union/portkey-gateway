import { PREDIBASE } from '../../globals';
import {
  ChatCompletionResponse,
  ErrorResponse,
  ProviderConfig,
} from '../types';
import {
  generateErrorResponse,
  generateInvalidProviderResponseError,
} from '../utils';

export const PredibaseChatCompleteConfig: ProviderConfig = {
  user: {
    param: 'user',
    required: true,
  },
  model: {
    param: 'model',
    required: true,
    default: 'mistral-7b-instruct-v0-2',
  },
  messages: {
    param: 'messages',
    required: true,
    default: [],
  },
  max_tokens: {
    param: 'max_tokens',
    default: 2048,
    min: 0,
  },
  temperature: {
    param: 'temperature',
    default: 0.1,
    min: 0,
    max: 1,
  },
  //Add more parameters once prototype with basics works.
  /*
  ignore_eos_token: {
    param: 'ignore_eos_token',
    default: false,
  },
  top_p: {
    param: 'top_k',
    default: 1,
    min: 0,
    max: 1,
  },
  */
  /*
  ignore_eos_token: bool = False,
  best_of: Optional[int] = None,
  repetition_penalty: Optional[float] = None,
  return_full_text: bool = False,
  seed: Optional[int] = None,
  stop_sequences: Optional[List[str]] = None,
  temperature: Optional[float] = None,
  top_k: Optional[int] = None,
  top_p: Optional[float] = None,
  truncate: Optional[int] = None,
  typical_p: Optional[float] = None,
  */
};

interface PredibaseChatCompleteResponse extends ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface PredibaseErrorResponse extends ErrorResponse {}

export const PredibaseChatCompleteResponseTransform: (
  response: PredibaseChatCompleteResponse | PredibaseErrorResponse,
  responseStatus: number
) => ChatCompletionResponse | ErrorResponse = (response, responseStatus) => {
  if ('error' in response && responseStatus !== 200) {
    return generateErrorResponse(
      {
        message: response.error.message,
        type: response.error.type,
        param: null,
        code: response.error.code?.toString() || null,
      },
      PREDIBASE
    );
  }

  if ('choices' in response) {
    return {
      id: response.id,
      object: response.object,
      created: response.created,
      model: response.model,
      provider: PREDIBASE,
      choices: response.choices.map((c) => ({
        index: c.index,
        message: c.message,
        logprobs: c.logprobs,
        finish_reason: c.finish_reason,
      })),
      usage: {
        prompt_tokens: response.usage?.prompt_tokens || 0,
        completion_tokens: response.usage?.completion_tokens || 0,
        total_tokens: response.usage?.total_tokens || 0,
      },
    };
  }

  return generateInvalidProviderResponseError(response, PREDIBASE);
};
