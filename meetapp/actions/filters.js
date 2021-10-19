export const updateFilters = filters => dispatch => {
    dispatch({type: "UPDATE_FILTERS", payload: filters})
}