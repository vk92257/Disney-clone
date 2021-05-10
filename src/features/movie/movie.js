import {createSlice}from '@reduxjs/toolkit';
const initialState = {
    newDisney : '',
    recommanded: '',
    orignals: '',
    trending: '',
}

const monvieSlice = createSlice(
    {nmae : 'movie',
    initialState,
    reducers: {
        setMovie : (state, action )=>{
            state.newDisney = action.payload.newDisney;
            state.recommanded = action.payload.recommanded;
            state.orignals = action.payload.orignals;
            state.trending = action.payload.trending;
        }
    }
}

);

export const {setMovie} = monvieSlice.actions;
export const selectRecommanded = state => state.movie.recommanded;
export const selectNewDisney = state => state.movie.newDisney;
export const selectTrending= state => state.movie.trending;
export const selectOrignals = state => state.movie.orignals;