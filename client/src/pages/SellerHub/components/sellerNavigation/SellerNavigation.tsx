import React, {lazy, Suspense} from "react";
import {BiChevronsDown, FaBars, FaUser} from "react-icons/all";
import { Link, useLocation } from "react-router-dom";
import { toggleLeftSidebarAction } from "actions/appAction";
import { useDispatch } from "react-redux";
import staticImagePath from "src/utills/staticImagePath";
import Circle from "UI/Circle/Circle";


const MoreDropdown = lazy(()=>import("pages/SellerHub/components/sellerNavigation/MoreDropdown"));
const AuthDropdown = lazy(()=>import("pages/SellerHub/components/sellerNavigation/AuthDropdown"));

const SellerNavigation = ({auth}) => {
	const location = useLocation();
	const dispatch = useDispatch();
    
    const [state, setState] = React.useState({
        openDropdown: ""
    })
    
    
    function handleToggleLeftBar() {
		toggleLeftSidebarAction(dispatch);
	}
    
    function handleSignOut(e){
    
    }

	return (
		<div>
            <div className="px-5 shadow-xxs bg-white fixed w-full">
			<header className="flex items-center justify-between py-3">
				<div className="logo flex items-center">
					<Circle
                        className="md:hidden block mr-3"
                        onClick={handleToggleLeftBar}
                    >
						<FaBars className="text-sm" />
					</Circle>

					<Link to="/seller/dashboard" className="flex items-center">
						<img src="/logo-2.png" alt="" className="w-9 md:w-11" />
						<h4 className="text-neutral-900 font-semibold text-lg md:text-xl   md:block">
							Dream Bazar
						</h4>
					</Link>
				</div>
				<div className="flex items-center gap-x-4">
					<Circle
                        className="relative"
                        onMouseEnter={() =>
                            setState({ ...state, openDropdown: "more" })
                        }
                        onMouseLeave={() =>
                            setState({ ...state, openDropdown: "" })
                        }
                    >
						<BiChevronsDown />
						<Suspense fallback={<h1>loading</h1>}>
							<MoreDropdown
                                className="right-0 top-10 !shadow-xl rounded-xl"
                                isShow={state.openDropdown === "more"}
                            />
						</Suspense>
					</Circle>
					<li
                        className="relative"
                        onMouseEnter={() =>
                            setState({ ...state, openDropdown: "auth" })
                        }
                        onMouseLeave={() =>
                            setState({ ...state, openDropdown: "" })
                        }
                    >
						<Link
                            to="/seller/login"
                            state={{ redirect: location.pathname }}
                        >
							{auth && auth.avatar ? (
                                <div className="w-9">
									<img
                                        className="rounded-full"
                                        src={staticImagePath(auth.avatar)}
                                        alt=""
                                    />
								</div>
                            ) : (
                                <Circle>
									<FaUser className="text-lg"></FaUser>
								</Circle>
                            )}
						</Link>

						<Suspense fallback={<h1>loading</h1>}>
							<AuthDropdown
                                auth={auth}
                                className="right-0 top-10 p-4 !shadow-xl rounded-xl"
                                isShow={state.openDropdown === "auth"}
                            />
						</Suspense>
					</li>
				</div>
			</header>
		</div>
            <div className="h-16"></div>
        </div>
	);
};


export default SellerNavigation;