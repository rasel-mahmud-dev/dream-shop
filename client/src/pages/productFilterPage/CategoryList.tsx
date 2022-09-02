// import { FaSolidAngleRight } from "solid-icons/fa";
// import { createEffect, createSignal, For } from "solid-js";
// import { findCategoryBrand } from "src/utils";

import qstring from "query-string";

import {useEffect, useState} from "react";
import apis from "src/apis";
import {useNavigate} from "react-router-dom";
import {FaAngleRight} from "react-icons/all";


export interface CategoryType{
    name: string,
    id: string,
    parentId: string,
    sub?: CategoryType[]
}

function CategoryList(props) {

    const [categories, setCategories] = useState<{[key: string] :CategoryType} | null>(null);
    const [flatCategories, setFlatCategories] = useState<CategoryType[] | null>(null);
    
    const [fetchCategories, setFetchCategories] = useState<{[key: string]: CategoryType} | null>(null)

    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
    const [brands, setBrands] = useState(null);

    const navigate = useNavigate()

    function findChildCategory(categories: CategoryType[], parentId: string) {
        let items = {}
        categories.filter(cat=>{
            if(cat.parentId === parentId){
                items[cat.id] = cat
            }
        })
        return items
    }

    function findRootCategories(categories: {id: string, parentId: string}[]) {
        let items: {[key: string]: CategoryType} = {}
        categories.filter(cat=>{
            if(!cat.parentId || cat.parentId === '0'){
                items[cat.id] = cat
            }
        })
        return items
    }

    const deepFreeze = (obj) => {
        obj && Object.keys(obj).forEach(prop => {
            if (typeof obj[prop] === 'object') deepFreeze(obj[prop]);
        });
        return {...obj};
    };
    
    function isRootCat(cat: {parentId?: string}){
        return !cat.parentId || cat.parentId === '0'
    }

    function isExpanded(categories: any, cat: {id: string}){
        return !categories[cat.id] || !!categories[cat.id].sub
    }

    async function handleExpandChildCategory(item: CategoryType){

        setSelectedCategory(item)

        let updateCategory: any = {...fetchCategories}
        
        if(isRootCat(item)){
            navigate(`/p?cat=${item.name}`)
            
            if(isExpanded(updateCategory, item)) {
                // collapse all and show all root categories
                
                if(flatCategories) {
                    // get root categories from cache categories
                    // setFetchCategories(findRootCategories(flatCategories))
                } else {
                    // get root categories from categories sqlite database
                    let rootCategories = await getCategories('parentId=0')
                    if (rootCategories) {
                        setFetchCategories(findRootCategories(rootCategories))
                    }
                }
         
            } else {
                // expand sub category of root category
                let subCategory = await getCategories(`parentId=${item.id}`)
                if (subCategory) {
                    let findOneRoot: CategoryType  = updateCategory[item.id]
                    if(findOneRoot) {
                        findOneRoot.sub = subCategory
                        // delete other root level categories.
                        // only exists clicked root categories
                        setFetchCategories({[findOneRoot.id]: findOneRoot})
                    }
                }
            }
            return;
        }
    
        let data = qstring.parse(location.hash)
        if("/p?cat" in data){
            navigate(`/p?cat=${data["/p?cat"]}&cat_tree=${item.name}`)
        }
        
        let subCategory: CategoryType[] | undefined = undefined
        if(flatCategories) {
            // get root categories from cache categories
            // setFetchCategories(findRootCategories(flatCategories))
        } else {
            subCategory = await getCategories(`parentId=${item.id}`)
        }
    
        if (subCategory) {
            let findNestedOne = findNestedCategory(updateCategory, item.id)
            if(findNestedOne) {
                findNestedOne.sub = subCategory
                // update n level nested category
                setFetchCategories(updateCategory)
                return;
            }
        }
    }

    function findNestedCategory(categories: CategoryType[] | {[key: string]: CategoryType} | any, catId: string){
        if(typeof categories === "object"){
            if(Array.isArray(categories)){
                for (const category of categories) {
                    if (category.id === catId) {
                        return category
                    } else {
                        if (category.sub) {
                            return findNestedCategory(category.sub, catId)
                        }
                    }
                }
            } else {
                for (const categoriesKey in categories) {
                    if (categories[categoriesKey] === catId) {
                        return categories[categoriesKey]
                    } else {
                        if (categories[categoriesKey].sub) {
                            return findNestedCategory(categories[categoriesKey].sub, catId)
                        }
                    }
                }
            }
        }
    }
    
    useEffect(()=>{
        (async function(){
            let data = qstring.parse(location.hash)
            if("/p?cat" in data && "cat_tree" in data){
                if(!fetchCategories) {
                    let a = await getAllCategories()
                    if (a) {
                        // setFlatCategories(a);
                        let newCategories = getRootLevelNested([...a], "Motherboard", "Electronics")
                        if(newCategories) {
                            setFetchCategories({[newCategories.id]: newCategories})
                            let lastItem  = a.find(item=> item.name === data["cat_tree"]);
                            setSelectedCategory(lastItem)
                        }
                    }
                }
            } else if("/p?cat" in data){
                 let rootCategories = await getCategories('parentId=0')
                if(rootCategories) {
                    let result: any = {}
                    for (const rootCategoriesKey in rootCategories) {
                        result[rootCategories[rootCategoriesKey].id] = rootCategories[rootCategoriesKey]
                    }
                    let rootSelected  = rootCategories.find(item=> item.name === data["/p?cat"]);
                    setSelectedCategory(rootSelected)
                    setFetchCategories(result)
                }
            }
        }())
    }, [location.search])

    async function getCategories(query: string){
        return new Promise<CategoryType[] | undefined>(async (resolve, reject)=>{
            let response = await apis.get<CategoryType[] | undefined>(`/api/category?${query}`)
            if(response) {
                resolve(response.data)
            } else{
                resolve(undefined)
            }
        })
    }

    async function getAllCategories(){
        return new Promise<CategoryType[] | undefined>(async (resolve, reject)=>{
            let response = await apis.get<CategoryType[] | undefined>(`/api/categories`)
            if(response) {
                resolve(response.data)
            } else{
                resolve(undefined)
            }
        })
    }

    function handleChangeCategory(item: {name: string, _id: string}){

        let updatedCategory = state.filter.category
        if(updatedCategory && updatedCategory._id === item._id){
            updatedCategory = null
            setBrands(null)
        } else {
            updatedCategory = {
                name: item.name,
                _id: item._id
            }
            let brands = findCategoryBrand(state.brands, updatedCategory._id)
            setBrands(brands)
        }

        setFilter({
            ...state.filter,
            brands: [],
            category: updatedCategory,

        })
    }

    function handleChangeBrand(item: {name: string, _id: string}){
        let updatedBrands = [...state.filter.brands]

        let index = updatedBrands.findIndex(b=>b._id === item._id)

        if(index === -1){
            updatedBrands = [
                ...updatedBrands,
                item
            ]
        } else {
            updatedBrands.splice(index, 1)
        }
        setFilter({
            ...state.filter,
            brands: updatedBrands
        })
    }

    function findChild(fetchCategories: CategoryType[], cat: CategoryType){
        fetchCategories?.forEach(catItem=> {
            if (catItem.id === cat.id) {
                console.log(catItem)
            }
        })
    }
    
    
    function getRootLevelNested(data, last, parent){
        function findParent(data, item){
            return  data.find(el => el.id === item.parentId);
        }
        
        function getAndSetChild(data, el, lastLevel, parent){
            
            if(lastLevel) {
                let lastChildren = data.filter(item => item.parentId === el.id);
                if (lastChildren && lastChildren.length) {
                    el.sub = lastChildren
                }
                // look forward one step up
                return getAndSetChild(data, el, false, parent)
                
            } else{
                let step = findParent(data, el)
                if(step) {
                    let stepChildren = findChildren(data, el)
                    step.sub = stepChildren
                    
                    // step iteration because we found root level
                    if (step.name === parent) {
                        return step;
                    } else {
                        return getAndSetChild(data, step, false, parent)
                    }
                }
            }
        }
        
        function getParent(data, last, parent) {
            let result = {}
            for (let i = 0; i < data.length; i++) {
                const el = data[i];
                if (el.name === last) {
                    result =  getAndSetChild(data, el, true, parent)
                    break;
                }
            }
            return result;
        }
        
        function findChildren(data, item){
            return data.filter(d=>d.parentId === item.parentId)
        }
        
        return getParent(data, last, parent)
    }

    async function handleClickItem(item: CategoryType){
        handleExpandChildCategory(item)
    }
    

    return (
        <div className="hidden md:block col-span-3 ">
            <div className="grid px-4">
                {/*{state.filter?.category && <div className="flex flex-wrap gap-2 mt-4">*/}
                {/*    <div*/}
                {/*        onClick={() => handleChangeCategory(state.filter?.category)}*/}
                {/*        className="bg-green-500/10 px-4 py-2 rounded flex justify-between">*/}
                {/*        <span>{state.filter?.category.name}</span>*/}
                {/*        <span className="ml-2 text-red-500 font-medium cursor-pointer">x</span>*/}
                {/*    </div>*/}
                {/*</div> }*/}

                <h1 className="font-bold text-2xl  mt-8">Category</h1>
                <RenderRecurtion fetchCategories={fetchCategories} handleClickItem={handleClickItem} selectedCategory={selectedCategory} />
                {/*<RecursiveRenderCategory*/}
                {/*    selectedCategory={selectedCategory}*/}
                {/*    category={categories}*/}
                {/*    handleClick={handleClick}*/}
                {/*    filterCategory={false}*/}
                {/*/>*/}
            </div>

            <div className="grid px-4">
                <h1 className="font-bold text-2xl mt-8">Brands</h1>
                {/* Selected brands  */}
                {/*{state.filter?.brands && <div className="flex flex-wrap gap-2 mt-4">*/}
                {/*    <For each={state.filter.brands}>*/}
                {/*        {(brand)=>(*/}
                {/*            <div*/}
                {/*                onClick={() => handleChangeBrand(brand)}*/}
                {/*                className="bg-green-500/10 px-4 py-2 rounded flex justify-between">*/}
                {/*                <span>{brand.name}</span>*/}
                {/*                <span className="ml-2 text-red-500 font-medium cursor-pointer">x</span>*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </For>*/}

                {/*</div> }*/}


                {/* brand list */}
                {/*<div className="">*/}
                {/*    <For each={brands() ? brands() : state.brands} fallback={<div>Loading...</div>}>*/}
                {/*        {(item) => (*/}
                {/*            <li onClick={() => handleChangeBrand(item)} className="flex justify-between items-center hover:text-green-400 cursor-pointer select-none my-2">*/}
                {/*                <label className="font-medium cursor-pointer">{item.name}</label>*/}
                {/*                <input checked={state.filter.brands && state.filter.brands.findIndex(b=> b._id === item._id) !== -1 } type="checkbox" />*/}
                {/*            </li>*/}
                {/*        )}*/}
                {/*    </For>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

const RenderRecurtion =({fetchCategories, handleClickItem, selectedCategory})=>{
    
    return <div>
        { fetchCategories && !Array.isArray(fetchCategories) && Object.keys(fetchCategories).map(key=>(
            <div className="ml-4">
                <li
                    onClick={()=>handleClickItem(fetchCategories[key])}
                    className={`flex items-center justify-between px-1 py-2 ${selectedCategory && selectedCategory.id === fetchCategories[key].id ? "bg-blue-500 text-white" : ""} `}>
                    <span>{fetchCategories[key].name}</span>
                    <FaAngleRight />
                </li>
                { fetchCategories[key].sub && fetchCategories[key].sub.length && <RenderRecurtion selectedCategory={selectedCategory} fetchCategories={fetchCategories[key].sub} handleClickItem={handleClickItem}/> }
            </div>
        ))}
    
        { fetchCategories && Array.isArray(fetchCategories) && (
            <div className="ml-4">
                {fetchCategories.map(item=>(
                    <div className="ml-4">
                        <h1 onClick={()=>handleClickItem(item)}
                            className={`flex items-center justify-between px-1 py-2 ${selectedCategory && selectedCategory.id === item.id ? "bg-blue-500 text-white" : ""} `}>
                            {item.name}
                        </h1>
                        { item.sub && item.sub.length && <RenderRecurtion  selectedCategory={selectedCategory} fetchCategories={item.sub} handleClickItem={handleClickItem}/> }
                    </div>
                ))}
            </div>
        )}
    </div>
}


export default CategoryList;


