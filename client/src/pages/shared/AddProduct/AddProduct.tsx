import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {InputGroup} from "UI/Form";
import SelectGroup from "UI/Form/SelectGroup";
import Card from "UI/Form/Card/Card";
import FileUpload from "UI/Form/File/FileUpload";
import {Button} from "UI/index";
import MultipleFileChooser from "UI/Form/File/MultipleFileChooser";
import generateSku from "src/utills/generateSku";
import {ProductDescriptionType, Roles, StatusCode} from "store/types";
import errorMessageCatch from "src/utills/errorMessageCatch";

import useToast from "src/hooks/useToast";

import apis from "src/apis";
import ProductAttribute from "pages/shared/AddProduct/ProductAttribute";
import ProductSpecification, {Specification} from "pages/shared/AddProduct/ProductSpecification";
import ActionModal from "components/ActionModal/ActionModal";
import {fetchBrands} from "actions/brandAction";
import useAppDispatch from "src/hooks/useAppDispatch";
import useAppSelector from "src/hooks/useAppSelector";
import {CategoryDetail} from "reducers/categoryReducer";
import {fetchCategoryDetail, fetchFlatCategoriesAction} from "actions/categoryAction";
import useScrollTop from "src/hooks/useScrollTop";
import {ProductType} from "reducers/productSlice";



const AddProduct = ({roleFor}) => {
    const params = useParams();
    const dispatch = useAppDispatch();

    useScrollTop()

    const {productId} = params

    const navigate = useNavigate();


    const [toast] = useToast();

    const {
        categoryState: {flatCategories},
        brandState: { allBrands}
    } = useAppSelector(state => state);

    const [httpResponse, setHttpResponse] = useState({
        message: "",
        isSuccess: false,
        loading: false,
    });

    const [state, setState] = useState({
        isShowStaticChooser: false,
        staticImages: [],
        attributeValue: {},
        categoryDetail: {
            // _id: "",
            // catId: "",
            // catName: "",
            // defaultExpand: [],
            // filterAttributes: [],
            filterAttributesValues: null,
            productDescriptionSectionInput: {
                // [sectionName]: [
                //     {specificationName: string, value: string, required: boolean},
                //     {specificationName: string, value: string, required: boolean}
                // ]
            },

            // renderProductAttr: []
        },
        specifications: {},
        productDescription: {
            details: {},
        },
    });


    const [newProductData, setNewProductData] = useState({
        title: {value: "", errorMessage: "", required: true},
        coverPhoto: {value: null, errorMessage: "", required: true},
        images: {
            value: [
                // {blob: "", base64: "", fileName: "", url: ""}
            ],
            errorMessage: "",
            required: true,
        },
        categoryId: {value: "", errorMessage: "", required: true},
        brandId: {value: "", errorMessage: "", required: true},
        price: {value: 0, errorMessage: "", required: true},
        qty: {value: 1, errorMessage: "", required: true},
        shippingCost: {value: 0, errorMessage: "", required: true},
        tax: {value: 0, errorMessage: "", required: false},
        discount: {value: 0, errorMessage: "", required: true},
        videoLink: {value: "", errorMessage: "", required: false},
        sku: {value: "", errorMessage: "", required: true},
        summary: {value: "", errorMessage: "", required: true},
        productType: {value: "Physical", errorMessage: "", required: true},
        minOrder: {value: 0, errorMessage: "", required: false},
    })

    const [productDetail, setProductDetail] = useState<ProductDescriptionType>({})
    const [product, setProduct] = useState<ProductType>({} as ProductType)

    const [categoryDetail, setCategoryDetail] = useState<CategoryDetail>({} as CategoryDetail)

    useEffect(() => {
        if (!allBrands || allBrands?.length === 0) {
            dispatch(fetchBrands())
        }

        fetchFlatCategoriesAction(flatCategories, dispatch);

    }, []);


    function fetchProductDetail(productId: string) {
        return new Promise<[any, any]>(async (resolve) => {
            try {
                let {status, data} = await apis.get(`/api/product/detail/${productId}`)
                if (status === StatusCode.Ok) {
                    resolve([data, null])
                }

            } catch (ex) {
                resolve([null, errorMessageCatch(ex)])
            }
        })
    }

    function fetchProduct(productId: string) {
        return new Promise<[any, any]>(async (resolve) => {
            try {
                let {status, data} = await apis.get(`/api/product?id=${productId}`)
                if (status === StatusCode.Ok) {
                    resolve([data, null])
                }

            } catch (ex) {
                resolve([null, errorMessageCatch(ex)])
            }
        })
    }




    // fetch product data that need to update
    useEffect(() => {
        (async function(){
            if (!(productId && productId.length === 24)) return

            let [product] = await fetchProduct(productId)
            if(product) {
                let updateProductData = {...newProductData};

                for (let updateProductDataKey in updateProductData) {
                    if (product[updateProductDataKey]) {
                        updateProductData[updateProductDataKey].value = product[updateProductDataKey];
                    }
                }

                let [productDetailData] =  await fetchProductDetail(productId)
                if(productDetailData){
                    if(productDetailData.summary){
                        updateProductData["summary"].value = productDetailData.summary;
                    }
                    setProductDetail(productDetailData)
                }
                setNewProductData(updateProductData)
                setProduct(product)
            }
        }())
    }, [productId]);


    // fetch category detail when change product category id
    useEffect(()=>{
        if(newProductData.categoryId.value){
            fetchCategoryDetail(newProductData.categoryId.value).then(([data]) => {
                if(data) {

                    setCategoryDetail(data)
                }
            })
        }
    }, [newProductData.categoryId.value])


    function handleChange(e) {
        const {name, value} = e.target;
        let updateProductData = {...newProductData};

        if (name === "logo") {
            updateProductData = {
                ...updateProductData,
                [name]: {
                    ...updateProductData[name],
                    value: value,
                    errorMessage: updateProductData[name] ? "" : updateProductData[name].errorMessage,
                },
            };
        } else {
            updateProductData = {
                ...updateProductData,
                [name]: {
                    ...updateProductData[name],
                    value: value,
                    errorMessage: updateProductData[name] ? "" : updateProductData[name].errorMessage,
                },
            };
        }

        setNewProductData(updateProductData);
    }


    function generateNewProductSku() {
        setNewProductData((prev) => {
            return {
                ...prev,
                sku: {value: generateSku(), errorMessage: "", required: true}
            };
        });
    }


    function handleAttributeChange(attributes) {
        setState((prevState) => ({
            ...prevState,
            attributeValue: attributes
        }))
    }

    function handleChangeSpecification(specifications: Specification) {
        setState(prevState => ({...prevState, specifications: specifications}))
    }


    // handle update or add Product
    async function handleSubmit(e) {
        e.preventDefault();
        setHttpResponse((p) => ({...p, message: "", isSuccess: false}));

        let isCompleted = true;
        let errorMessage = "";
        let payload = {};
        let formData = new FormData();
        for (let newProductDataKey in newProductData) {
            if (newProductData[newProductDataKey].required) {
                if (
                    newProductData[newProductDataKey].value == 0 &&
                    newProductDataKey !== "categoryId" &&
                    newProductDataKey !== "brandId" &&
                    newProductDataKey !== "price" &&
                    newProductDataKey !== "qty"
                ) {
                    payload[newProductDataKey] = newProductData[newProductDataKey].value;
                } else if (!newProductData[newProductDataKey].value) {
                    isCompleted = false;
                    errorMessage = newProductDataKey + " required";
                    break;
                } else {
                    payload[newProductDataKey] = newProductData[newProductDataKey].value;
                }
            } else {
                payload[newProductDataKey] = newProductData[newProductDataKey].value;
            }
        }

        if (!isCompleted) {
            setHttpResponse((p) => ({...p, message: errorMessage, isSuccess: false}));
            return;
        }

        const {specifications, attributeValue} = state

        /********** Product attribute value ************/
        if (attributeValue) {
            // if (!Object.keys(attributeValue).length) {
            //     errorMessage = "Please provide attribute fields";
            //     setHttpResponse((p) => ({...p, message: errorMessage, isSuccess: false}));
            //     return;
            // }
        }
        // add Product details sections
        formData.append("attributes", JSON.stringify(attributeValue));


        /********** deep specification section ************/
        /* make it like and send to server
            { General: {"In The Box" :  "value"}}
        * */
        let isDoneSpecifications = true;
        let specificationValues = {};
        for (let specificationsKey in specifications) {
            if (specifications[specificationsKey] && specifications[specificationsKey].length > 0) {
                let specificationForSection = {};
                specifications[specificationsKey].forEach((specification) => {
                    specificationForSection[specification.specificationName] = specification.value ? specification.value : "";
                });
                specificationValues[specificationsKey] = specificationForSection;
            }
        }

        if (!isDoneSpecifications) {
            let msg = "Please provide description required field";
            return setHttpResponse((p) => ({...p, message: msg, isSuccess: false}));
        }


        // add Product details sections
        formData.append("specification", JSON.stringify(specificationValues));

        for (let payloadKey in payload) {
            if (payloadKey === "images") {
                payload[payloadKey] &&
                payload[payloadKey].forEach((item, index) => {
                    if (item.blob) {
                        formData.append(payloadKey + "-" + index, item.blob, item.fileName);
                    } else if (item.url) {
                        formData.append(payloadKey, item.url);
                    }
                });
            } else if (payloadKey === "coverPhoto") {
                if (payload[payloadKey] && typeof payload[payloadKey] === "object") {
                    formData.append(payloadKey, payload[payloadKey], payload[payloadKey]?.name);
                }
            } else {
                if (payload[payloadKey]) {
                    formData.append(payloadKey, payload[payloadKey]);
                }
            }
        }

        try {

            setHttpResponse(p => ({...p, message: "", loading: true}));
            let redirectPath = roleFor === Roles.ADMIN ? "admin" : "seller"

            if (productId) {
                formData.append("_id", params.productId)
                let {status, data} = await apis.patch("/api/product/" + params.productId, formData);
                if (status === StatusCode.Created) {

                    setTimeout(() => {
                        setHttpResponse({message: data.message, loading: false, isSuccess: true});
                        navigate(   `/${redirectPath}/products`)
                    }, 300)

                }
            } else {
                let {status, data} = await apis.post("/api/product", formData);
                if (status === StatusCode.Created) {

                    setTimeout(() => {
                        setHttpResponse({message: data.message, loading: false, isSuccess: true});
                        navigate(   `/${redirectPath}/products`)
                    }, 300)
                }
            }
        } catch (ex) {
            setTimeout(() => {
                setHttpResponse({message: errorMessageCatch(ex), loading: false, isSuccess: false});
            }, 300)
        } finally {
            setHttpResponse(p => ({...p, message: "", loading: false, isSuccess: true}));
        }
    }

    function handleFilWithFakeData() {
        setNewProductData((prevState: any) => ({
            ...prevState,
            title: {value: "Iphone 100", errorMessage: "", required: true},
            price: {value: 150000, errorMessage: "", required: true},
            qty: {value: 10, errorMessage: "", required: true},
            shippingCost: {value: 200, errorMessage: "", required: true},
            tax: {value: 10, errorMessage: "", required: false},
            discount: {value: 20, errorMessage: "", required: true},
            videoLink: {value: "", errorMessage: "", required: false},
            sku: {value: 232425, errorMessage: "", required: true},
            summary: {value: "Some dummy post descriptions", errorMessage: "", required: true},
            productType: {value: "Physical", errorMessage: "", required: true},
            minOrder: {value: 1, errorMessage: "", required: false},
        }))

        setCategoryDetail(null as unknown as CategoryDetail)
    }



    return (
        <div className="">
            <h1 className="route-title">{productId ? "Update Product" : "Add Product"}</h1>

            <ActionModal
                {...httpResponse}
                loadingTitle={`Product is  ${productId ? "Updating" : "Adding"}...`}
                onClose={() => httpResponse.message !== "" && setHttpResponse((p) => ({...p, message: ""}))}/>

            <form onSubmit={handleSubmit}>
                <Card>

                    {/*<InputGroup*/}
                    {/*    state={state.userData}*/}
                    {/*    name="email"*/}
                    {/*    inputClass="bg-input-group"*/}
                    {/*    onChange={handleChange}*/}
                    {/*    placeholder={l("Enter Email")}*/}
                    {/*/>*/}

                    <InputGroup
                        name="title"
                        required={newProductData.title.required}
                        label="Product Title"
                        className="!flex-col   "
                        state={newProductData}
                        placeholder="New Product"
                        onChange={handleChange}
                    />
                    <InputGroup
                        name="summary"
                        label="Summary"
                        as="textarea"
                        className="!flex-col   "
                        required={newProductData.summary.required}
                        state={newProductData}
                        placeholder="Product summary"
                        onChange={handleChange}
                    />
                </Card>

                {/*********** General Information **********/}
                <Card>
                    <h5 className="heading-5">General Information</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <SelectGroup
                            required={newProductData.productType.required}
                            name="categoryId"
                            className={"!flex-col"}
                            label="Product Type"
                            placeholder="categoryId"
                            onChange={handleChange}
                            state={newProductData}
                            options={() => (
                                <>
                                    <option className="cursor-pointer py-1 menu-item" value="Physical">
                                        Physical
                                    </option>
                                    <option className="cursor-pointer py-1 menu-item" value="digital">
                                        Digital
                                    </option>
                                </>
                            )}
                        />
                        <SelectGroup
                            required={newProductData.categoryId.required}
                            name="categoryId"
                            labelClass="dark:text-white !mb-2"
                            className={"!flex-col"}
                            label="Category"
                            inputClass="bg-input-group"
                            placeholder="categoryId"
                            onChange={handleChange}
                            state={newProductData}
                            options={() => (
                                <>
                                    <option value="">Category</option>

                                    {flatCategories
                                        ?.filter((cat: any) => cat.isProductLevel)
                                        .map((cat: any) => (
                                            <option key={cat._id} className="cursor-pointer py-1 menu-item" value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </>
                            )}
                        />

                        <SelectGroup
                            name="brandId"
                            className={"!flex-col"}
                            label="Brand"
                            required={newProductData.brandId.required}
                            placeholder="brandId"
                            onChange={handleChange}
                            state={newProductData}
                            options={() => (
                                <>
                                    <option value="">Brand</option>
                                    <option className="cursor-pointer py-1 menu-item" value="63c063e7310ae08eea4d6929">
                                        Other
                                    </option>
                                    { allBrands?.map((cat: any) => (
                                            <option key={cat._id} className="cursor-pointer py-1 menu-item" value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </>
                            )}
                        />

                        <InputGroup
                            name="sku"
                            required={newProductData.sku.required}
                            label="Product Code Sku"
                            labelAddition={() => (
                                <span className="text-blue-500 cursor-pointer font-medium active:text-blue-400 " onClick={generateNewProductSku}>
                                    Generate Code
                                </span>
                            )}
                            className="!flex-col "
                            state={newProductData}
                            placeholder="Code"
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                {/*********** Filter Attributes Information **********/}
                <ProductAttribute
                    productDetail={productDetail}
                    defaultAttribute={product.attributes}
                    onAttributeChange={handleAttributeChange}
                    categoryDetail={categoryDetail}
                />

                {/******* Product Price and Stock **************/}
                <Card>
                    <h5 className="heading-5">Product Price and Stock</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputGroup
                            required={newProductData.discount.required}
                            name="discount"
                            label="Discount"
                            type="number"
                            className="!flex-col"
                            inputClass="bg-input-group"
                            labelClass="dark:text-white !mb-2"
                            state={newProductData}
                            placeholder="Discount"
                            onChange={handleChange}
                        />
                        <InputGroup
                            required={newProductData.price.required}
                            name="price"
                            label="Price"
                            type="number"
                            className="!flex-col"
                            inputClass="bg-input-group"
                            labelClass="dark:text-white !mb-2"
                            state={newProductData}
                            placeholder="Price"
                            onChange={handleChange}
                        />
                        <InputGroup
                            name="tax"
                            label="Tax"
                            type="number"
                            required={newProductData.tax.required}
                            className="!flex-col"
                            labelAddition={() => (
                                <span className="badge bg-teal-400/10 text-teal-400 font-medium px-1 py-px rounded text-xs">Percent %</span>
                            )}
                            inputClass="bg-input-group"
                            labelClass="dark:text-white !mb-2"
                            state={newProductData}
                            placeholder="Tax"
                            onChange={handleChange}
                        />

                        <InputGroup
                            name="qty"
                            required={newProductData.qty.required}
                            label="Total Quantity"
                            type="number"
                            className="!flex-col"
                            inputClass="bg-input-group"
                            labelClass="dark:text-white !mb-2"
                            state={newProductData}
                            placeholder="qty"
                            onChange={handleChange}
                        />

                        <InputGroup
                            name="minOrder"
                            required={newProductData.minOrder.required}
                            label="Minimum Order Quantity"
                            type="number"
                            className="!flex-col"
                            inputClass="bg-input-group"
                            labelClass="dark:text-white !mb-2 w-full"
                            state={newProductData}
                            placeholder="Minimum order quantity"
                            onChange={handleChange}
                        />
                        <InputGroup
                            name="shippingCost"
                            required={newProductData.shippingCost.required}
                            label="Shipping Cost"
                            type="number"
                            className="!flex-col"
                            inputClass="bg-input-group"
                            labelClass="dark:text-white !mb-2"
                            state={newProductData}
                            placeholder="Shipping cost"
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                {/******** Product Cover and Photos **********/}
                <Card>
                    <h5 className="heading-5">Product Cover and Photos</h5>

                    <InputGroup
                        required={newProductData.videoLink.required}
                        name="videoLink"
                        label="Youtube Video Link"
                        className="!flex-col"
                        inputClass="bg-input-group"
                        labelClass="dark:text-white !mb-2"
                        state={newProductData}
                        placeholder="EX: https://www.youtube.com/embed/5Rdsf45"
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <MultipleFileChooser
                            required={newProductData.images.required}
                            name="images"
                            label="Upload Product Images"
                            labelAddition={() => <span className="text-xs font-medium">Ratio (1:1)</span>}
                            inputClass="bg-input-group"
                            onChange={handleChange}
                            defaultValue={newProductData.images.value}
                            labelClass="dark:text-white !mb-2"
                            className={"mt-4 col-span-3"}
                        />

                        {/*********** Cover **************/}
                        <FileUpload
                            name="coverPhoto"
                            required={newProductData.coverPhoto.required}
                            label="Upload Thumbnail"
                            labelAddition={() => <span className="text-xs font-medium">Ratio (1:1)</span>}
                            inputClass="bg-input-group"
                            placeholder="Choose Cover Photo"
                            onChange={handleChange}
                            defaultValue={newProductData.coverPhoto.value}
                            labelClass="dark:text-white !mb-2"
                            className={"!flex-col col-span-2 !w-40"}
                        />
                    </div>

                    <h2>
                        <Button
                            // onClick={()=>handleToggleStaticImageChooserModal(!isShowStaticChooser)}
                            type="button"
                            className="btn bg-green-500 !py-1.5 mt-2"
                        >
                            Or Select Static Photos
                        </Button>
                    </h2>
                </Card>


                {/******** Product Description sections **********/}
                <ProductSpecification
                    categoryDetail={categoryDetail}
                    defaultValue={productDetail.specification}
                    onChangeSpecifications={handleChangeSpecification}
                />


                <Card className="mb-10">


                    <div className="flex items-center gap-x-4 mt-6">
                        <Button type="submit" className="bg-secondary-300 ">
                            {!params.productId ? "Add Product" : "Update Product"}
                        </Button>

                        <Button type="button" onClick={handleFilWithFakeData}
                                className="bg-secondary-300 ">
                            Fil-Up Fake Data
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default AddProduct;
