import React from "react";
import "./HomePage.scss"
import {ACTION_TYPES} from "store/types"
import {connect, useDispatch} from "react-redux"
import {Link, useNavigate} from "react-router-dom"
import {fetchHomePageSectionProducts, fetchProducts} from "actions/productAction"
import {addToCart} from "actions/cartAction"
import {Button, Carousel,  Image, Menu, Popup, Spin} from "UI/index"
import {closeNotify} from "actions/appAction"
import {isEn} from "src/lang"
import fullLink from "src/utills/fullLink";

import HomeProductNavigation from "pages/homePage/HomeProductNavigation";
import staticImagePath from "src/utills/staticImagePath";

// import "slick-carousel/slick/slick-theme.css";

let id;

const HomePage = (props) => { 
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const {
    homePageSectionsData,
    homePageSectionProducts: productSectionsWithProduct,
    products,
    loadingStates,
    paginations,
    fetchedData
  } = props.productState
  
    const carouselData = [
      {img:"ff548b9075708229.jpg", desc: "asdkfh asf hasdkfj haskdj fhasasd  asdfd asdf asdfas hsadjf asdjfh", title: "Awesome phone"},
      {img:"a7f93e9e0f7b947f.jpg", desc: "asdkfh asf hasdkfj haskdj fhasasd  asdfd asdf asdfas hsadjf asdjfh", title: "Awesome phone"},
      {img:"bf3d1c8a7696dfd9-1.jpg", desc: "asdkfh asf hasdkfj haskdj fhasasd  asdfd asdf asdfas hsadjf asdjfh", title: "Awesome phone"},
      {img:"ff548b9075708229.jpg", desc: "asdkfh asf hasdkfj haskdj fhasasd  asdfd asdf asdfas hsadjf asdjfh", title: "Awesome phone"}
    ]
  
  const { selectedLang,lang } = props.appState

  const [pagination, setPagination] = React.useState({perSection: 2, sectionNumber: 1})

  function loadMoreSection(where){ 
    dispatch({
      type: ACTION_TYPES.UNLOCK_FETCHED_DATA,
      payload: "home_page"
    })
    
    dispatch({
      type: ACTION_TYPES.CHANGE_PAGINATION,
      payload: {where}
    })
  }

  function handler(e){
    return document.body.scrollTop || document.documentElement.scrollTop
  }
  
  
  React.useEffect(()=>{

    props.fetchHomePageSectionProducts()

    // let fetchedDataa =  fetchedData.find(fd=>fd.where === "home_page")
    // console.log(fetchedDataa)
    // if(!fetchedDataa.isFetched) {
    //   props.fetchHomePageSectionProducts()
    // } else {
    //
    // }
  }, [paginations]) // with watch when change paginations currentPage


  function handleScroll(e){
  // let el = e.target
  // let offsetTop  = handler(e)
  // let tscroll = (el.scrollTop + el.clientHeight)
  // let sum = e.target.scrollHeight - tscroll

  // if(sum <= 0){
  //   setPagination({
  //     ...pagination,
  //     sectionNumber: pagination.sectionNumber + 1
  //   })  
  // }
}
  
  
  async function handleMoreItem(sectionName, obj){
    // let old = {...productSectionsWithProduct} 
    // let res;
    // if(obj[sectionName].type === "categories" || obj[sectionName].type === "brands"){
    //     // fetch more category or brand without change route 
    //     // this means ... remove more item down this section  
      
    //   if(obj[sectionName].type === "categories"){
    //     res = await api.get("/api/categories") 
    //     old[sectionName].values.push(...res.data.categories) 
    //   } else {
    //     res = await api.get("/api/brands") 
    //     old[sectionName].values.push(...res.data.brands) 
    //   }
   
    //   let arr = [...old[sectionName].values] 
    //   let uniqArr = []
    //   for(let i=0; i<arr.length; i++){
    //     if(uniqArr.findIndex(p=>p._id === arr[i]._id  )  === -1 ) {
    //       uniqArr.push(arr[i])
    //     }
    //   }
    //   old[sectionName].values = uniqArr
    //   setProductSectionsWithProduct(old)
    // }
  }
  

  
  function renderProduct(product){
    return (
      <div className="product">
        <Image  maxWidth={20} src={"df"}/>
        <h5 className="product_name">{product.title}</h5>
        <h5 className="product_price">${product.price}</h5>
        <Button onClick={()=> handleAddToCart(product)}>Add To Cart</Button>
        <Link to={`/products/${product._id}`}>Details</Link>
      </div>
    )                  
  }
  
  function handleJumpOneTypeProductPage(sectionName, productSectionsWithProduct){
    let n;
    homePageSectionsData.map(item=> {
      if(item.name === sectionName && !item.id){
        // history.push(`/prod/${item.name}/${item.type}/${item.params}`)
        navigate(`/prod/${item.name}`)
      } else if(item.name === sectionName && item.id){
        navigate(`/products/?slug=${item.name}&type=${item.filterBy}&id=${item.id}`)
      }
    })
  }
  
  function renderLoader(where, btnLabel, handler){
    let loadingState = loadingStates.find(ls=>ls.where === where)  
    if(loadingState){
      return (
        <div style={{display: "flex", justifyContent: "center"}}>
          { loadingState && loadingState.isLoading 
             ? <Spin size={20} borderWidth={2} loaderColor="green"  />
             : <Button onClick={()=>handler(where)}>{btnLabel}</Button>
          }
        </div>
      )
    }
  }
  
  
  //! this a Bug 
  function handleAddToCart(pp){
    props.closeNotify()
    props.addToCart(pp)
  }
  
  function onChange(){
    
  }
  
  function renderSectionName(sectionName){ 
    switch(sectionName){
      case "Top Selling products":
        return "besi bicroy kora ponnno" 
      
      case "Top Popular products":
        return lang.top_popular_products
        
      case "Shop By Categories":
        return "kena kata dara category"
        
      case "Shop By Brands":
        return lang.shop_by_brands
        
      default: 
        return sectionName
    }
  }
    
    return (
      <div className="homepage">


        <HomeProductNavigation/>

        <div>
          <div className="homepage_slider">
            <Carousel>
              { carouselData.map(item=>(
                  <div className="relative">
                    <img src={staticImagePath(item.img)} alt=""/>
                    <div className="swiper-caption">
                      <h1 className="slider-title font-medium text-3xl text-white ">{item.title}</h1>
                      <h1 className="slider-para text-white ">{item.desc}</h1>
                      <Button className="slider-btn">Shop Now</Button>
                    </div>
                  </div>
              )) }
            </Carousel>
        </div>
       </div>


        <div className="r max-w-8xl mx-auto" onScroll={handleScroll}>
        
           <div>
        
            { Object.keys(productSectionsWithProduct) && Object.keys(productSectionsWithProduct).map(sectionName=>(
              <>
              <div className="product_section_header">
                  <div className="product_section_header__header">
                    <h1>{isEn(selectedLang) ? sectionName : renderSectionName(sectionName)}</h1>
                    { productSectionsWithProduct[sectionName].type === "products"
                    && null
                    }
                    <Button onClick={()=>handleJumpOneTypeProductPage(sectionName, productSectionsWithProduct)}>{ isEn(selectedLang) ? 'More' : lang.more } </Button>
                  </div>
        
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {productSectionsWithProduct[sectionName]
                  && productSectionsWithProduct[sectionName].values
                  && productSectionsWithProduct[sectionName].values.length > 0 ? productSectionsWithProduct[sectionName].values.map(pp => (
                    <div className="product bg-red-100">
                      {productSectionsWithProduct[sectionName].type === "brands" || productSectionsWithProduct[sectionName].type === "categories"
                        ? <div className="product_image small">
                          <img src={fullLink(pp.logo)} alt=""/>
                        </div>
                        : (
                          <div className="product_image_div">
                            <div className="product_image_wra">

                              <img src={staticImagePath(pp.cover_photo)} alt="AAAAAAAAAAAAA"/>
                            </div>
                          </div>
                          // <div className="product_image">
                          //       <img src={fullLink(pp.cover_photo)} alt=""/>
                          //     </div>
                        )
                      }
                      <div className="desc">
                        <h4 className="product_name">
                          <Link to="">
                            {
                              productSectionsWithProduct[sectionName].type === "categories"
                                ? pp.name
                                : productSectionsWithProduct[sectionName].type === "brands"
                                  ? pp.name
                                  : pp.title
              
                            } </Link>
                        </h4>
                        {productSectionsWithProduct[sectionName].type === "products"
                        && (
                          <>
                            <h5 className="product_price">${pp.price}</h5>
                            {/*<Button onClick={()=>handleAddToCart(pp)}>{ isEn(selectedLang) ? 'Add To Cart': lang.add_to_cart}</Button>*/}
                            {/*<Link className="product-detail-link" to={`/products/${pp._id}`}> { isEn(selectedLang) ? 'Details' : lang.details}</Link>*/}
                          </>
                        )
                        }
                      </div>
                    </div>
                  )) : (
                    <ProductNotFound />
                  )
                  }
                </div>
        
                </div>
        
        
        
        
        
             { /* productSectionsWithProduct[sectionName].type !== "products"
               && (
                  <div style={{textAlign: "center"}}>
                   { loadState === "load-start"
                   ? <Spin size={20} />
                   : <Button onClick={()=>handleMoreItem(sectionName, productSectionsWithProduct)} >Load More</Button>
                   }
                  </div>
               )
             */ }
              </>
            
            ))  }
            
            {/* This is Home Page Section Loading State Loading State   */}
           {renderLoader("home_section", "Load More Section", loadMoreSection)}
        
        
          </div>
          
        
        </div>
      </div>
    )

}

function ProductNotFound(){
  return (
    <div className="product-404">
      <h1 className="product-404__title">Product Not Found</h1>
      <ul className="product-404__causes">
        <li>May be product not found from database.</li>
        <li>May be network problem.</li>
        <li>May not added these type of product from admin.</li>
      </ul>
    </div>
  )
}

function mapStateToProps(state){
  return {
    appState: state.appState,
    productState: state.productState
  }
}

export default connect(mapStateToProps, {
  fetchProducts,
  fetchHomePageSectionProducts,
  addToCart,
  closeNotify
})(HomePage)   

