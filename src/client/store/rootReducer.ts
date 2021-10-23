import { combineReducers } from '@reduxjs/toolkit';
import { reducer as projectsBoardReducer } from 'src/client/slices/projects_board';

const rootReducer = combineReducers({
  projectsBoard: projectsBoardReducer,
});

export default rootReducer;
