/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
export namespace ApiAiConstants {
  export enum AVAILABLE_LANGUAGES {
    EN = "en" as any, DE = "de" as any, ES = "es" as any, PT_BR = "pt-BR" as any, ZH_HK = "zh-HK" as any,
    ZH_CN = "zh-CN" as any, ZH_TW = "zh-TW" as any, NL = "nl" as any, FR = "fr" as any, IT = "it" as any,
    JA = "ja" as any, KO = "ko" as any, PT = "pt" as any, RU = "ru" as any, UK = "uk" as any
  }

  export const VERSION: string = "2.0.0-beta.20";
  export const DEFAULT_BASE_URL: string = "https://api.api.ai/v1/";
  export const DEFAULT_API_VERSION: string = "20150910";
  export const DEFAULT_CLIENT_LANG: AVAILABLE_LANGUAGES = AVAILABLE_LANGUAGES.EN;
}
