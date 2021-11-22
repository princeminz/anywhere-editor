import { createOvermind } from "overmind";
import { createStateHook, createActionsHook } from "overmind-react";

export const useAppState = createStateHook();
export const useActions = createActionsHook();

import { initialState } from "./state";
import * as actions from "./actions";
import * as effects from "./effects";

export const store = createOvermind({
  state: initialState,
  actions,
  effects,
});
