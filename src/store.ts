import { createStore, combineReducers, AnyAction } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import { reducers as mainReducers } from "./ui-main/reducers.main";
import { reducers as objectEditorReducers } from "./ui-main/object-editor/reducers.object-editor";
import { MainState, defaultMainState } from "./ui-main/state.main";
import {
  ObjectEditorState,
  defaultObjectEditorState
} from "./ui-main/object-editor/state.object-editor";

export interface AppState {
  main: MainState;
  objectEditor: ObjectEditorState;
}

export const defaultAppState: AppState = {
  main: defaultMainState,
  objectEditor: defaultObjectEditorState
};

export const store = createStore<AppState, AnyAction, {}, {}>(
  combineReducers({
    main: mainReducers,
    objectEditor: objectEditorReducers
  }),
  defaultAppState,
  composeWithDevTools()
);
