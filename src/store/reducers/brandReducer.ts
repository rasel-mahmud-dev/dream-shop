import {ACTION_TYPES, Brand, CategoryType} from "src/store/types";
import {BrandActionTypes} from "store/types/brandActionTypes";

export interface BrandStateType {
    brands: {
        total: number;
        cached: any[];
    };
    /// make caching brand for individual category
    brandsForCategory: {},
}


const initialState: BrandStateType = {
    /// make caching brand for individual category
    brandsForCategory: {},
    brands: {
        total: 0,
        cached: [],
    },
};


const brandReducer = (state: BrandStateType = initialState, action: BrandActionTypes) => {
    let updatedState: BrandStateType = {...state};

    switch (action.type) {

        /// make caching brand for individual category
        case ACTION_TYPES.FETCH_CATEGORY_BRANDS:
            let updatesBrandForCategory = {...updatedState.brandsForCategory}
            updatesBrandForCategory[action.payload.categoryName] = action.payload.brands;
            return {
                ...updatedState,
                brandsForCategory: updatesBrandForCategory
            };

        default:
            return state;
    }
};



export default brandReducer
