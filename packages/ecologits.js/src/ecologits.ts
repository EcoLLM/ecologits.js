//import fetch from "node-fetch";
import computeLlmImpacts from "./impacts/dag.js";
import { DEFAULT_IMPACT } from "./impacts/default.js";

type ModelData = {
  provider: string;
  name: string;
  totalParameters: number[];
  activeParameters: number[];
  warnings: string;
  sources: string;
};

class EcoLogitsData {
  data: ModelData[] = [];

  constructor(data: ModelData[]) {
    if (data.length === undefined) {
      throw new Error("Cannot be called directly. Use build() instead.");
    }
    this.data = data;
  }

  findModel(provider: string, name: string): ModelData | undefined {
    return this.data.find(
      (model) => model.provider === provider && model.name === name
    );
  }

  average(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  computeLlmImpacts(
    provider: string,
    modelName: string,
    outputTokenCount: number,
    requestLatency: number
  ) {
    const model = this.findModel(provider, modelName);
    if (!model) {
      return DEFAULT_IMPACT;
    }
    const modelActiveParams = this.average(model.activeParameters);
    const modelTotalParams = this.average(model.totalParameters);
    return computeLlmImpacts(
      modelActiveParams,
      modelTotalParams,
      outputTokenCount,
      requestLatency
    );
  }
}
const url =
  "https://raw.githubusercontent.com/genai-impact/ecologits/refs/tags/0.5.0/ecologits/data/models.csv";
const text = `provider,name,total_parameters,active_parameters,warnings,sources
openai,gpt-35-turbo,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-35-turbo-0125,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo-0125,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-35-turbo-0301,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo-0301,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-35-turbo-0613,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo-0613,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-35-turbo-1106,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo-1106,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-35-turbo-16k,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo-16k,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-35-turbo-16k-0613,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo-16k-0613,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-35-turbo-instruct-0914,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo-instruct,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-35-turbo-instruct,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-3.5-turbo-instruct-0914,20;70,20;70,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4,1760,220;880,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4-32k,1760,220;880,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4-0125-preview,1760,220;880,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4-0613,1760,220;880,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4-32k-0613,1760,220;880,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4-1106-preview,1760,220;880,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4-1106-vision-preview,1760,220;880,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4-turbo-preview,880,110;440,model_architecture_not_released,
openai,gpt-4-vision-preview,1760,220;880,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit
openai,gpt-4-turbo,880,110;440,model_architecture_not_released,
openai,gpt-4-turbo-2024-04-09,880,110;440,model_architecture_not_released,
openai,gpt-4o,440,55;220,model_architecture_not_released,
openai,gpt-4o-2024-05-13,440,55;220,model_architecture_not_released,
openai,gpt-4o-mini,8,8,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1kc262HZSMAWI6FVsh0zJwbB-ooYvzhCHaHcNUiA0_hY/edit
openai,gpt-4o-mini-2024-07-18,8,8,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1kc262HZSMAWI6FVsh0zJwbB-ooYvzhCHaHcNUiA0_hY/edit
mistralai,mistral-large-2402,540,135;540,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-large-latest,540,135;540,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-medium,70;180,45;180,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-medium-2312,70;180,45;180,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-medium-latest,70;180,45;180,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-small,46.7,12.9,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-small-2312,46.7,12.9,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-small-2402,46.7,12.9,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-small-latest,46.7,12.9,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
mistralai,mistral-tiny,7.3,7.3,,https://docs.mistral.ai/models/#sizes 
mistralai,mistral-tiny-2312,7.3,7.3,,https://docs.mistral.ai/models/#sizes 
mistralai,open-mistral-7b,7.3,7.3,,https://docs.mistral.ai/models/#sizes 
mistralai,open-mixtral-8x7b,46.7,46.7,,https://docs.mistral.ai/models/#sizes 
mistralai,open-mixtral-8x22b,140.6,39.1,,https://docs.mistral.ai/getting-started/open_weight_models/#sizes
mistralai,open-mixtral-8x22b-2404,140.6,39.1,,https://docs.mistral.ai/getting-started/open_weight_models/#sizes
mistralai,codestral-2405,22.2,22.2,,https://docs.mistral.ai/getting-started/open_weight_models/#sizes
mistralai,codestral-latest,22.2,22.2,,https://docs.mistral.ai/getting-started/open_weight_models/#sizes
mistralai,open-mistral-nemo,12.2,12.2,,https://docs.mistral.ai/getting-started/open_weight_models/#sizes
mistralai,open-mistral-nemo-2407,12.2,12.2,,https://docs.mistral.ai/getting-started/open_weight_models/#sizes
anthropic,claude-3-opus-20240229,2000,250;1000,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
anthropic,claude-3-sonnet-20240229,800,100;400,model_architecture_not_released,
anthropic,claude-3-5-sonnet-20240620,800,100;400,model_architecture_not_released,
anthropic,claude-3-haiku-20240307,300,75;150,model_architecture_not_released,
anthropic,claude-2.1,130,130,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
anthropic,claude-2.0,130,130,model_architecture_not_released,https://docs.google.com/spreadsheets/d/1O5KVQW1Hx5ZAkcg8AIRjbQLQzx2wVaLl0SqUu-ir9Fs/edit?usp=sharing
anthropic,claude-instant-1.2,20;70,20;70,model_architecture_not_released,
cohere,command-light,6,6,,https://docs.oracle.com/en-us/iaas/Content/generative-ai/pretrained-models.htm
cohere,command-light-nightly,6,6,,
cohere,command,52,52,,https://docs.oracle.com/en-us/iaas/Content/generative-ai/pretrained-models.htm
cohere,command-nightly,52,52,,
cohere,command-r,35,35,,https://huggingface.co/CohereForAI/c4ai-command-r-v01
cohere,command-r-plus,104,104,,https://huggingface.co/CohereForAI/c4ai-command-r-plus-4bit
huggingface_hub,HuggingFaceH4/zephyr-7b-beta,7.24,7.24,,https://huggingface.co/HuggingFaceH4/zephyr-7b-beta
huggingface_hub,meta-llama/Meta-Llama-3-8B,8.03,8.03,,https://huggingface.co/meta-llama/Meta-Llama-3-8B
huggingface_hub,meta-llama/Meta-Llama-3-8B-Instruct,8.03,8.03,,https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct
huggingface_hub,meta-llama/Meta-Llama-3-70B,70.6,70.6,,https://huggingface.co/meta-llama/Meta-Llama-3-70B
huggingface_hub,meta-llama/Meta-Llama-3-70B-Instruct,70.6,70.6,,https://huggingface.co/meta-llama/Meta-Llama-3-70B-Instruct
huggingface_hub,meta-llama/Meta-Llama-Guard-2-8B,8.03,8.03,,https://huggingface.co/meta-llama/Meta-Llama-Guard-2-8B
huggingface_hub,meta-llama/Llama-2-7b-hf,6.74,6.74,,https://huggingface.co/meta-llama/Llama-2-7b-hf
huggingface_hub,meta-llama/Llama-2-13b-hf,13,13,,https://huggingface.co/meta-llama/Llama-2-13b-hf
huggingface_hub,meta-llama/Llama-2-70b-hf,69,69,,https://huggingface.co/meta-llama/Llama-2-70b-hf
huggingface_hub,meta-llama/Llama-2-7b-chat-hf,6.74,6.74,,https://huggingface.co/meta-llama/Llama-2-7b-chat-hf
huggingface_hub,meta-llama/Llama-2-13b-chat-hf,13,13,,https://huggingface.co/meta-llama/Llama-2-13b-chat-hf
huggingface_hub,meta-llama/Llama-2-70b-chat-hf,69,69,,https://huggingface.co/meta-llama/Llama-2-70b-chat-hf
huggingface_hub,meta-llama/LlamaGuard-7b,6.74,6.74,,https://huggingface.co/meta-llama/LlamaGuard-7b
huggingface_hub,meta-llama/CodeLlama-7b-hf,6.74,6.74,,https://huggingface.co/meta-llama/CodeLlama-7b-hf
huggingface_hub,meta-llama/CodeLlama-13b-hf,13,13,,https://huggingface.co/meta-llama/CodeLlama-13b-hf
huggingface_hub,meta-llama/CodeLlama-34b-hf,33.7,33.7,,https://huggingface.co/meta-llama/CodeLlama-34b-hf
huggingface_hub,meta-llama/CodeLlama-70b-hf,69,69,,https://huggingface.co/meta-llama/CodeLlama-70b-hf
huggingface_hub,meta-llama/CodeLlama-7b-Python-hf,6.74,6.74,,https://huggingface.co/meta-llama/CodeLlama-7b-Python-hf
huggingface_hub,meta-llama/CodeLlama-34b-Python-hf,33.7,33.7,,https://huggingface.co/meta-llama/CodeLlama-34b-Python-hf
huggingface_hub,meta-llama/CodeLlama-13b-Python-hf,13,13,,https://huggingface.co/meta-llama/CodeLlama-13b-Python-hf
huggingface_hub,meta-llama/CodeLlama-70b-Python-hf,69,69,,https://huggingface.co/meta-llama/CodeLlama-70b-Python-hf
huggingface_hub,meta-llama/CodeLlama-7b-Instruct-hf,6.74,6.74,,https://huggingface.co/meta-llama/CodeLlama-7b-Instruct-hf
huggingface_hub,meta-llama/CodeLlama-13b-Instruct-hf,13,13,,https://huggingface.co/meta-llama/CodeLlama-13b-Instruct-hf
huggingface_hub,meta-llama/CodeLlama-34b-Instruct-hf,33.7,33.7,,https://huggingface.co/meta-llama/CodeLlama-34b-Instruct-hf
huggingface_hub,meta-llama/CodeLlama-70b-Instruct-hf,69,69,,https://huggingface.co/meta-llama/CodeLlama-70b-Instruct-hf
huggingface_hub,mistralai/Mistral-7B-v0.1,7.24,7.24,,https://huggingface.co/mistralai/Mistral-7B-v0.1
huggingface_hub,mistralai/Mistral-7B-v0.3,7.24,7.24,,https://huggingface.co/mistralai/Mistral-7B-v0.3
huggingface_hub,mistralai/Mistral-7B-Instruct-v0.1,7.24,7.24,,https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1
huggingface_hub,mistralai/Mistral-7B-Instruct-v0.2,7.24,7.24,,https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2
huggingface_hub,mistralai/Mistral-7B-Instruct-v0.3,7.24,7.24,,https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3
huggingface_hub,mistralai/Mixtral-8x22B-Instruct-v0.1,140.6,39.1,,https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1
huggingface_hub,mistralai/Mixtral-8x22B-v0.1,140.6,39.1,,https://huggingface.co/mistralai/Mixtral-8x22B-v0.1
huggingface_hub,mistralai/Mixtral-8x7B-Instruct-v0.1,46.7,12.9,,https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1
huggingface_hub,mistralai/Mixtral-8x7B-v0.1,46.7,12.9,,https://huggingface.co/mistralai/Mixtral-8x7B-v0.1
huggingface_hub,mistralai/Codestral-22B-v0.1,22.2,22.2,,https://huggingface.co/mistralai/Codestral-22B-v0.1
huggingface_hub,mistralai/Mistral-Nemo-Instruct-2407,12.2,12.2,,https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407
huggingface_hub,mistralai/Mistral-Nemo-Base-2407,12.2,12.2,,https://huggingface.co/mistralai/Mistral-Nemo-Base-2407
huggingface_hub,mistralai/mathstral-7B-v0.1,7.24,7.25,,https://huggingface.co/mistralai/mathstral-7B-v0.1
huggingface_hub,mistral-community/Mixtral-8x22B-v0.1-original,140.6,39.1,,https://huggingface.co/mistral-community/Mixtral-8x22B-v0.1-original
huggingface_hub,mistral-community/Mixtral-8x22B-v0.1,140.6,39.1,,https://huggingface.co/mistral-community/Mixtral-8x22B-v0.1
huggingface_hub,mistral-community/Mixtral-8x22B-v0.1-AWQ,140.6,39.1,,https://huggingface.co/mistral-community/Mixtral-8x22B-v0.1-AWQ
huggingface_hub,mistral-community/Mixtral-8x22B-v0.1-4bit,140.6,39.1,,https://huggingface.co/mistral-community/Mixtral-8x22B-v0.1-4bit
huggingface_hub,mistral-community/Mistral-7B-v0.2,7.24,7.24,,https://huggingface.co/mistral-community/Mistral-7B-v0.2
huggingface_hub,mistral-community/Mistral-7B-Instruct-v0.3,7.24,7.24,,https://huggingface.co/mistral-community/Mistral-7B-Instruct-v0.3
huggingface_hub,mistral-community/Mixtral-8x22B-Instruct-v0.1-4bit,140.6,39.1,,https://huggingface.co/mistral-community/Mixtral-8x22B-Instruct-v0.1-4bit
huggingface_hub,mistral-community/mixtral-8x22B-v0.3,140.6,39.1,,https://huggingface.co/mistral-community/mixtral-8x22B-v0.3
huggingface_hub,mistral-community/mixtral-8x22B-v0.3-original,140.6,39.1,,https://huggingface.co/mistral-community/mixtral-8x22B-v0.3-original
huggingface_hub,mistral-community/mixtral-8x22B-Instruct-v0.3-original,140.6,39.1,,https://huggingface.co/mistral-community/mixtral-8x22B-Instruct-v0.3-original
huggingface_hub,mistral-community/Codestral-22B-v0.1,22.2,22.2,,https://huggingface.co/mistral-community/Codestral-22B-v0.1
huggingface_hub,CohereForAI/c4ai-command-r-v01,35,35,,https://huggingface.co/CohereForAI/c4ai-command-r-v01
huggingface_hub,CohereForAI/c4ai-command-r-v01-4bit,19.1,19.1,,https://huggingface.co/CohereForAI/c4ai-command-r-v01-4bit
huggingface_hub,CohereForAI/c4ai-command-r-plus,104,104,,https://huggingface.co/CohereForAI/c4ai-command-r-plus
huggingface_hub,CohereForAI/c4ai-command-r-plus-4bit,55.1,55.1,,https://huggingface.co/CohereForAI/c4ai-command-r-plus-4bit
huggingface_hub,CohereForAI/aya-23-8B,8.03,8.03,,https://huggingface.co/CohereForAI/aya-23-8B
huggingface_hub,CohereForAI/aya-23-35B,35,35,,https://huggingface.co/CohereForAI/aya-23-35B
huggingface_hub,databricks/dbrx-base,132,36,,https://huggingface.co/databricks/dbrx-base
huggingface_hub,databricks/dbrx-instruct,132,36,,https://huggingface.co/databricks/dbrx-instruct
huggingface_hub,databricks/dolly-v1-6b,6,6,,https://huggingface.co/databricks/dolly-v1-6b
huggingface_hub,databricks/dolly-v2-12b,12,12,,https://huggingface.co/databricks/dolly-v2-12b
huggingface_hub,databricks/dolly-v2-7b,7,7,,https://huggingface.co/databricks/dolly-v2-7b
huggingface_hub,databricks/dolly-v2-3b,3,3,,https://huggingface.co/databricks/dolly-v2-3b
google,gemini-1.5-flash,20;70,20;70,model_architecture_not_released,https://deepmind.google/technologies/gemini/flash/
google,gemini-1.5-pro,440,55;220,model_architecture_not_released,https://deepmind.google/technologies/gemini/pro/
google,gemini-1.0-pro,20;70,20;70,model_architecture_not_released,https://deepmind.google/technologies/gemini/pro/`;
const ecoLogitsData: EcoLogitsData =
      new EcoLogitsData(
        text
          .split("\n")
          .slice(1, text.length)
          .reduce((acc, line) => {
            if (!line || typeof line !== "string" || !line.includes(",")) {
              return acc;
            }
            const infos = line.split(",");
            if (!infos[2] || !infos[3]) {
              return acc;
            }
            return [
              ...acc,
              {
                provider: infos[0],
                name: infos[1],
                totalParameters: infos[2].split(";").map((x) => parseFloat(x)),
                activeParameters: infos[3].split(";").map((x) => parseFloat(x)),
                warnings: infos[4],
                sources: infos[5],
              } as ModelData,
            ];
          }, [] as ModelData[])
      );

export default ecoLogitsData;
