export function clearErrorHelper(dispatch, actionType, payload) {
  dispatch({ type: actionType, payload });
} 