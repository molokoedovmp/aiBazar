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
import type * as aiGadgets from "../aiGadgets.js";
import type * as aiTools from "../aiTools.js";
import type * as aiToolsOrders from "../aiToolsOrders.js";
import type * as categories from "../categories.js";
import type * as creditPurchases from "../creditPurchases.js";
import type * as documents from "../documents.js";
import type * as favorites from "../favorites.js";
import type * as feedback from "../feedback.js";
import type * as feedbackMessages from "../feedbackMessages.js";
import type * as reviews from "../reviews.js";
import type * as services from "../services.js";
import type * as userCredits from "../userCredits.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiGadgets: typeof aiGadgets;
  aiTools: typeof aiTools;
  aiToolsOrders: typeof aiToolsOrders;
  categories: typeof categories;
  creditPurchases: typeof creditPurchases;
  documents: typeof documents;
  favorites: typeof favorites;
  feedback: typeof feedback;
  feedbackMessages: typeof feedbackMessages;
  reviews: typeof reviews;
  services: typeof services;
  userCredits: typeof userCredits;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
