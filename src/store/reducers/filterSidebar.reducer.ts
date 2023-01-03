import {ACTION_TYPES} from "store/types";
import {ProductStateType} from "reducers/productReducer";
import {ProductActionTypes} from "store/types/productActionTypes";


export default (state: ProductStateType, action: ProductActionTypes) => {
    let updateState = {...state}
    let itemIndex = -1
    switch (action.type) {
        
        
        case ACTION_TYPES.CHANGE_CATEGORY:
            updateState.filters = {
                ...updateState.filters,
                category: {
                    selected: action.payload.selected,
                    allNestedIds: action.payload.allNestedIds
                }
            }
            return updateState
        
        case ACTION_TYPES.FETCH_CATEGORY_BRANDS:
            const {categoryName, brands} = action.payload
            updateState.brandsForCategory = {
                ...updateState.brandsForCategory,
                [categoryName]: brands
            }
            return updateState
        
        
        case "SET_FILTER_ITEM_SECTIONS" :
            updateState.filterItem_sections_data = {
                category_id: action.payload.category_id,
                filterItem_sections: action.payload.filterItem_sections,
            }
            return updateState
        
        case "SET_SELECTED_CATEGORY_SECTIONS" :
            // updateState.selectedCatSections = action.payload
            return updateState
        
        // this is cat_tree last selected category...
        case "SET_CURRENT_NESTED_SUBCATEGORY" :
            
            // updateState.currentNestedSubCategory = action.payload
            return updateState
        
        case "SET_FILTER_SECTION_TOGGLE_EXPAND" :
            updateState.filterItem_sections_data = {
                ...updateState.filterItem_sections_data,
                filterItem_sections: action.payload,
            }
            return updateState
        
        case "REMOVE_ALL_FILTER_VALUE":
            return {
                ...updateState,
                filteredAttributes: [],
                filters: action.payload.filters,
            }



        case ACTION_TYPES.FETCH_CATEGORY_DETAILS:
            updateState.categoryDetail = {
                ...updateState.categoryDetail,
                [action.payload.catId]: action.payload
            }
            return updateState

        case ACTION_TYPES.TOGGLE_PRODUCT_ATTRIBUTE:
            const {  attributeName, categoryId  } = action.payload
            if(categoryId){
                let cat = updateState.categoryDetail[categoryId]
                if(cat && cat.defaultExpand){
                    if(cat.defaultExpand.includes(attributeName)){
                        cat.defaultExpand = cat.defaultExpand.filter(item=>item !== attributeName)
                    } else {
                        cat.defaultExpand.push(attributeName)
                    }
                }
            }
            return updateState
        
        default :
            return updateState
    }
}

