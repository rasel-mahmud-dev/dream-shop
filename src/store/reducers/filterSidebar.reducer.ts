import {ACTION_TYPES} from "store/types";
import {ProductStateType} from "reducers/productReducer";
import {ProductActionTypes} from "store/types/productActionTypes";


export default function filterSidebar (state: ProductStateType, action: ProductActionTypes){
    let updateState = {...state}
    let itemIndex = -1
    switch (action.type) {


        //
        //
        // case "SET_FILTER_ITEM_SECTIONS" :
        //     updateState.filterItem_sections_data = {
        //         category_id: action.payload.category_id,
        //         filterItem_sections: action.payload.filterItem_sections,
        //     }
        //     return updateState
        //
        // case "SET_SELECTED_CATEGORY_SECTIONS" :
        //     // updateState.selectedCatSections = action.payload
        //     return updateState
        //
        // // this is cat_tree last selected category...
        // case "SET_CURRENT_NESTED_SUBCATEGORY" :
        //
        //     // updateState.currentNestedSubCategory = action.payload
        //     return updateState
        //
        // case "SET_FILTER_SECTION_TOGGLE_EXPAND" :
        //     updateState.filterItem_sections_data = {
        //         ...updateState.filterItem_sections_data,
        //         filterItem_sections: action.payload,
        //     }
        //     return updateState
        //
        // case "REMOVE_ALL_FILTER_VALUE":
        //     return {
        //         ...updateState,
        //         filteredAttributes: [],
        //         filters: action.payload.filters,
        //     }





        
        default :
            return updateState
    }
}

