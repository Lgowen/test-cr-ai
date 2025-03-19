import { ChatOpenAI, AzureChatOpenAI } from "@langchain/openai";

import type { ZodType } from "zod";
import type { IFeedback } from "../types";
import { logger } from "../utils/logger";

interface IAIModel {
  modelName: string;
  provider: string;
  temperature: number;
  apiKey: string;
  retryCount?: number;
  baseURL?: string; // 新增OpenAI库需要的配置
  organization: string | undefined;
}

export class AIModel {
  private model: ChatOpenAI;

  constructor(options: IAIModel) {
    switch (options.provider) {
      case "doubao":
        this.model = new ChatOpenAI({
          apiKey: options.apiKey,
          ...(options.organization && { organization: options.organization }),
          temperature: options.temperature,
          modelName: options.modelName,
          configuration: {
            baseURL: options.baseURL
          }
        });
        break;
      case "openai":
        this.model = new ChatOpenAI({
          apiKey: options.apiKey,
          ...(options.organization && { organization: options.organization }),
          temperature: options.temperature,
          modelName: options.modelName,
        });
        break;
      case "azureai":
        this.model = new AzureChatOpenAI({
          temperature: options.temperature,
        });
        break;
      case "bedrock":
        throw new Error("Bedrock provider not implemented");
      default:
        throw new Error("Provider not supported");
    }
  }

  public async callModel(prompt: string): Promise<string | null> {
    const message = await this.model.invoke(prompt);
    return message.content[0] as string;
  }
  
  public async callStructuredModel(
    prompt: string,
    schema: ZodType
  ): Promise<IFeedback[]> {
    const modelWithStructuredOutput = this.model.withStructuredOutput(schema, {
      method: "jsonObject",
      strict: true,
      includeRaw: true,
    });
    const res = await modelWithStructuredOutput.invoke(prompt);

    logger.debug("LLm response", res);

    if (res.parsed) {
      return res.parsed;
    }

    // logger.debug('response', res.raw.content)

    return parseJson(res.raw.content as string);
  }
}
const parseJson = (json: string) => {
  logger.debug("Unparsed JSON", json);

  const jsonString = json
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/```/g, "\\`\\`\\`")
    .replace(/`/g, "\\`")
    .replace(/"/g, '\\"')
    .replace(/\f/g, "\\f")
    .replace(/\b/g, "\\b")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  logger.debug('Escaped JSON', jsonString);
  return JSON.parse(jsonString);
};
