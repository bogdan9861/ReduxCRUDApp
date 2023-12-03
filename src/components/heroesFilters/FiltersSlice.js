import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filterAdapter = createEntityAdapter({});

const initialState = filterAdapter.getInitialState({
    activeFilter: 'all',
    filterLoadingStatus: 'idle'
});

export const fetchFilters = createAsyncThunk(
    'filter/fetchFilters',
    () => {
        const { request } = useHttp();
        return request('http://localhost:3001/filters')
    }
)

const FiltersSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        addFilter: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {
                state.filterLoadingStatus = "loading";
            })
            .addCase(fetchFilters.fulfilled, (state, actions) => {
                state.filterLoadingStatus = 'idle'
                filterAdapter.setAll(state, actions);
            })
            .addCase(fetchFilters.rejected, state => {
                state.filterLoadingStatus = 'error'
            })
            .addDefaultCase(() => {});
    }
})

const { actions, reducer } = FiltersSlice;
export default reducer;

export const { selectAll } = filterAdapter.getSelectors(state => state.filters);
export const {
    addFilter
} = actions;