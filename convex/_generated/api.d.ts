/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.14.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as cibus_cibusActions from "../cibus/cibusActions.js";
import type * as cibus_cibusQueries from "../cibus/cibusQueries.js";
import type * as groceries from "../groceries.js";
import type * as shoppingList from "../shoppingList.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "cibus/cibusActions": typeof cibus_cibusActions;
  "cibus/cibusQueries": typeof cibus_cibusQueries;
  groceries: typeof groceries;
  shoppingList: typeof shoppingList;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
