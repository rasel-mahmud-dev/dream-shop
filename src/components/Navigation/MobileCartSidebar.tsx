import React from "react";
import Sidebar from "components/sidebar/Sidebar";
import { FaTimes } from "react-icons/all";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import staticImagePath from "src/utills/staticImagePath";
import ButtonGroup from "UI/Button/ButtonGroup";
import { Button } from "UI/index";
import Circle from "UI/Circle/Circle";
import "./mobileCartSidebar.scss";

const MobileCartSidebar = ({ isOpen, handleClose }) => {
    const { cartState } = useSelector((state: RootState) => state);


    const headers = [
        { title: "Image", dataIndex: "img", render: (img) => <img className="w-5" src={staticImagePath(img)} /> },
        { title: "Details", dataIndex: "title" },
        { title: "Quantity", dataIndex: "qty" },
        { title: "Total", dataIndex: "total" },
        {
            title: "Action",
            dataIndex: "",
            className: "text-center",
            render: (_, item) => (
                <ButtonGroup className="m-auto">
                    <Button className="bg-green-450 text-white rounded-r-none !px-4">-</Button>
                    <div>
                        <h1 className="px-3 font-medium ">{item.qty}</h1>
                    </div>
                    <Button className="bg-green-450 text-white !px-4 rounded-l-none">+</Button>
                </ButtonGroup>
            ),
        },
    ];


    return (
        <div>
            <Sidebar
                backdropClass="!bg-dark-900/20 mobile-cart-sidebar-backdrop"
                isOpen={isOpen}
                position="right"
                onClose={handleClose}
                className="mobile-cart-sidebar"
            >
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h4 className="heading-5">Your Cart</h4>
                        <Circle className="ml-auto !w-8 !h-8">
                            <FaTimes onClick={handleClose} className="" />
                        </Circle>
                    </div>
                    <div>
                        {cartState.cartProducts.map((cp) => (
                            <div className="flex items-center gap-x-2">
                                <img className="w-10" src={staticImagePath(cp.img)} alt="" />
                                <h1>{cp.title}</h1>
                            </div>
                        ))}
                    </div>

                    <div className="relative -bottom-full">
                        <Button className="bg-green-450">Checkout</Button>
                    </div>
                </div>
            </Sidebar>
        </div>
    );
};

export default MobileCartSidebar;