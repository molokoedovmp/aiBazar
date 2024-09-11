/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aiTools from "../aiTools.js";
import type * as categories from "../categories.js";
import type * as documents from "../documents.js";
import type * as favorites from "../favorites.js";
import type * as feedback from "../feedback.js";
import type * as reviews from "../reviews.js";
import type * as services from "../services.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiTools: typeof aiTools;
  categories: typeof categories;
  documents: typeof documents;
  favorites: typeof favorites;
  feedback: typeof feedback;
  reviews: typeof reviews;
  services: typeof services;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
