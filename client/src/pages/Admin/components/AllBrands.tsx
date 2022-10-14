import React, {} from "react";
import { Button } from "components/UI";
import apis from "src/apis";
import Table from "UI/table/Table";
import staticImagePath from "src/utills/staticImagePath";

import {
    BsPencilSquare,
    FcEmptyTrash,
} from "react-icons/all";
import {useDispatch, useSelector} from "react-redux";
import { toggleBackdrop} from "actions/appAction";
import {RootState} from "src/store";
import {InputGroup} from "UI/Form";
import FileUpload from "UI/Form/File/FileUpload";
import MultiSelect from "UI/Form/multiSelect/MultiSelect";
import {ACTION_TYPES} from "store/types";
import {deleteBrandAction, fetchFlatCategories} from "actions/productAction";
import ActionInfo from "components/ActionInfo/ActionInfo";
import errorMessageCatch from "src/utills/errorMessageCatch";



const AllBrands = (props) => {
    
    const { appState, productState : { flatCategories }} = useSelector((state: RootState)=>state)
    
    const [totalBrands, setTotalBrands] = React.useState<number>(0);
    const [brands, setBrands] = React.useState<any[]>([]);
    
    const dispatch = useDispatch();

    const [state, setState] = React.useState<any>({
        isShowForm: true,
        updateId: "",
        httpResponse: "",
        httpStatus: 200,
        formData: {
            name: {value: "", errorMessage: ""},
            logo: {value: null, blob: null, errorMessage: ""},
            forCategory: {value: [], errorMessage: ""},
        }
    });

    const {formData, isShowForm, updateId} = state
    
    
    async function fetchAllCategoryBrand(flatCategories){
        if(!flatCategories) {
            return fetchFlatCategories();
        }
    }
    
    React.useEffect(() => {
        Promise.allSettled([
            apis.get("/api/brands/count"),
            apis.get("/api/brands"),
            fetchAllCategoryBrand(flatCategories)
        ])
        .then((result)=>{
                if(result[0].status === "fulfilled"){
                    setBrands(result[0].value.data)
                }
                if(result[1].status === "fulfilled"){
                    setBrands(result[1].value.data);
                }
                if(result[2].status === "fulfilled"){
                    dispatch({
                        type: ACTION_TYPES.FETCH_CATEGORIES,
                        payload: result[2].value
                    })
                }
               
            })
    }, []);
    

    function deleteItem(id: any) {
        deleteBrandAction(dispatch, id, function(err, data){
            if(!err){
                setBrands(brands.filter(b=>b.id !== id))
            } else {
                console.log(err)
            }
        })
    }
    
    
    function handleChange(e) {
        const { name, value } = e.target
        let updateFormData = { ...state.formData }

        if(name === "logo") {
            updateFormData = {
                ...updateFormData,
                [name]: {
                    ...updateFormData[name],
                    value: value,
                    errorMessage: updateFormData[name] ? "" : updateFormData[name].errorMessage
                }
            }
        } else {
            updateFormData = {
                ...updateFormData,
                [name]: {
                    ...updateFormData[name],
                    value: value,
                    errorMessage: updateFormData[name] ? "" : updateFormData[name].errorMessage
                }
            }
        }
        setState({
            ...state,
            formData: updateFormData
        })
    }

    async function handleAdd(e) {
    
        let updateState = {...state}
        
        e.preventDefault();
    
        let isComplete = true
        let payload = new FormData();
        
        for (let item in formData) {
            
            if(item === "logo"){
                if(formData[item].value) {
                    if (typeof formData[item].value === "string") {
                        payload.append(item, formData[item].value)
                    } else {
                        payload.append(item, formData[item].value, formData[item].value.name)
                    }
                }
            } else if(item === "forCategory"){
                let categoryIds = []
                if(formData[item].value && Array.isArray(formData[item].value) && formData[item].value.length){
                    for(let cat of formData[item].value){
                        categoryIds.push(cat.id)
                    }
                } else {
                    formData[item].errorMessage = "Please select brand for category "
                }
                
                payload.append(item, JSON.stringify(categoryIds))
                
            } else {
                if(!formData[item].value){
                    isComplete = false;
                    formData[item].errorMessage = "Please enter " + item
                }
                payload.append(item, formData[item].value)
            }
        }
        
        if(!isComplete){
            updateState.httpStatus = 500
            updateState.httpResponse = "Please fill Input"
            setState(updateState)
            return;
        }
        
        updateState.httpStatus = 200
        updateState.httpResponse = "pending"
        
        setState(updateState)
        
        updateState = {...state}
 
        if(updateId){
            apis.patch("/api/brand/"+updateId, payload).then(({status, data})=>{
                if(status === 201) {
                    updateState.httpResponse = data.message
                    updateState.httpStatus = 200
                    
                    let updateBrands = brands
                    let index = updateBrands.findIndex(b=>b.id === updateId)
                    if(index !== -1){
                        brands[index] = {
                            ...brands[index],
                            ...data.brand
                        }
                    }
                    setBrands(updateBrands)
                }
            }).catch(ex=>{
                updateState.httpResponse = errorMessageCatch(ex);
                updateState.httpStatus = 500
                
            }).finally(()=>{
                setState(updateState)
            })
            
        } else {
            // add as a new brand
            apis.post("/api/brand", payload).then(({status, data})=>{
                if(status === 201) {
                    updateState.httpResponse = data.message
                    updateState.httpStatus = 200
                    setBrands([...brands, data.brand])
                }
            }).catch(ex=>{
                updateState.httpResponse = errorMessageCatch(ex);
                updateState.httpStatus = 500
            }).finally(()=>{
                setState(updateState)
            })
        }
    }
    
    
    function clearField(){
        let update = {...formData}
        for (let updateKey in update) {
            if (update[updateKey] && update[updateKey].value) {
                update[updateKey].value = ""
            }
        }
        return  update
    }
    
    function handleShowAddForm(isOpen=false) {
        setState({
            ...state,
            updateId: "",
            httpResponse: "",
            isShowForm: isOpen,
            formData: clearField()
        })
        dispatch(
            toggleBackdrop({
                isOpen: isOpen,
                scope: "custom"
            })
        );
    }
    
    function setUpdateBrandHandler(brand){
        let updateFormData = { ...state.formData }
        if(brand.name) {
            updateFormData.name = {value: brand.name, errorMessage: ""}
        }
        if(brand.logo){
            updateFormData.logo= {value: brand.logo, errorMessage: ""}
        }
        if(brand.forCategory){
            if(typeof brand.forCategory === "string"){
                try {
                    let b = JSON.parse(brand.forCategory)
                    let items = flatCategories.filter(c=> b.includes(c.id))
                    updateFormData.forCategory = {value: items, errorMessage: ""}
                    
                } catch (_){}
            }
        }
        
        setState({
            ...state,
            isShowForm: true,
            updateId: brand.id,
            formData: updateFormData
        })
        dispatch(
            toggleBackdrop({
                isOpen: true,
                scope: "custom"
            })
        );
        
    }
    
    function addBrandForm() {
        
        return (
            <form onSubmit={handleAdd}>
                <h2 className="h2 text-center !font-semibold">
                    {updateId  ?  "Update Brand" : "Add New Brand"}
                </h2>
                
                
                <ActionInfo
                    message={state.httpResponse}
                    statusCode={state.httpStatus}
                    className="mt-4"
                />
                

                <InputGroup
                    name={"name"}
                    label="Brand Name"
                    className="!flex-col"
                    inputClass="input-group"
                    labelClass="dark:text-white !mb-2"
                    state={formData}
                    placeholder="Enter Brand Name"
                    onChange={handleChange}
                />
                {/*********** Cover **************/}
  
                <FileUpload
                    name="logo"
                    label="Logo"
                    inputClass="input-group"
                    placeholder="Choose Cover Photo"
                    onChange={handleChange}
                    defaultValue={formData.logo.value}
                    labelClass="dark:text-white !mb-2"
                    errorMessage={formData.logo.errorMessage}
                    className={"!flex-col"}
                />
                
                <MultiSelect
                    name="forCategory"
                    labelClass="dark:text-white !mb-2"
                    dataKey={{title: "name", key: "id"}}
                    className={"!flex-col"}
                    value={formData.forCategory.value}
                    label="Select for Category"
                    inputClass="input-group"
                    placeholder="for category"
                    onChange={handleChange}
                    state={formData}
                    options={(onClick)=> <div className="bg-neutral-100 px-2 absolute top-0 left-0 w-full">
                        {flatCategories.map(cat=>(
                                <li onClick={()=>onClick(cat)} className="cursor-pointer py-1 menu-item">{cat.name}</li>
                            ))}
                            </div>}
                />

                <div className="flex items-center gap-x-4" >
                    <Button type="submit" className="bg-secondary-300 mt-4" loaderClass="!border-white" loading={state.httpResponse === "pending"}>
                    {!updateId ? "Save Brand" : "Update Brand"}
                </Button>

                <Button
                    type="button"
                    className="bg-secondary-300 mt-4"
                    onClick={() => handleShowAddForm(false)}
                >
                    Cancel
                </Button>
                </div>
            </form>
        );
    }
    
    const columns = [
        {
            title: "Logo",
            dataIndex: "logo",
            render: (item) => (
                <div className="w-8">
                    <img src={staticImagePath(item.logo)} alt="" />
                </div>
            ),
        },
        { title: "Name", dataIndex: "name" },
        { title: "CreatedAt", dataIndex: "createdAt" },
        {
            title: "Action",
            dataIndex: "",
            className: "text-center",
            render: (item) => (
                <div className="flex justify-center items-center gap-x-2">
                    <BsPencilSquare className="text-md cursor-pointer" onClick={()=>setUpdateBrandHandler(item)} />
                    <FcEmptyTrash className="text-xl cursor-pointer" onClick={()=>deleteItem(item.id)}/>
                </div>
            ),
        },
    ];
    

    return (
        <div className="pr-4">
            
            {/* add brand modal and backdrop */}
            {appState.backdrop.isOpen && <div className={`backdrop ${isShowForm ? "backdrop--show" : ""}`}>
                <div className="modal-box auth-card">
                    {addBrandForm()}
                </div>
            </div>}
            
            <div className="flex items-center justify-between mt-4">
                <h1 className="h2">Brands</h1>

                {!updateId ? (
                    <Button
                        className="mt-4 bg-secondary-300"
                        onClick={()=>handleShowAddForm(true)}>
                        Add New Brand
                    </Button>
                ) : (
                    <Button onClick={() => handleShowAddForm(false)}>Cancel</Button>
                )}
            </div>
            

            <h3 className="p">
                Brands fetch {brands?.length} of {totalBrands}{" "}
            </h3>

            <div className="card">
                <Table dataSource={brands ? brands : []} columns={columns} tbodyClass={{td: "py-2 px-2", tr: "hover:bg-green-500/10"}} />
            </div>
        </div>
    );
};

export default AllBrands