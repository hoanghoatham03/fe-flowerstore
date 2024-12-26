import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../store/reducers/cartReducer";
import { logout } from "../store/reducers/authReducer";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  Popover,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ShoppingCartIcon,
  DevicePhoneMobileIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { IoSearchOutline } from "react-icons/io5";

const products = [
  {
    name: "LAN HỒ ĐIỆP MINI",
    description: "Món quà nhỏ xinh, ý nghĩa lớn",
    href: "/category/11",
    image: "/assets/hoachucmung.webp",
  },
  {
    name: "CHẬU LAN HỒ ĐIỆP 3 CÀNH",
    description: "Sang trọng và đầy sức sống",
    href: "/category/12",
    image: "/assets/hoasinhnhat.webp",
  },
  {
    name: "CHẬU LAN HỒ ĐIỆP 5 CÀNH",
    description: "Tỏa sáng với phong cách riêng",
    href: "/category/13",
    image: "/assets/hoatinhyeu.webp",
  },
  {
    name: "CHẬU LAN HỒ ĐIỆP 10 CÀNH",
    description: "Đẳng cấp và phú quý",
    href: "/category/14",
    image: "/assets/lanhodiep.webp",
  },
];

const callsToAction = [
  { name: "Zalo", href: "https://zalo.me", icon: PhoneIcon },
  { name: "Điện Thoại", href: "19001783", icon: DevicePhoneMobileIcon },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    dispatch(logout());
    navigate("/");
    window.location.reload();
  };
  const handleCartClick = () => {
    if (user && token) {
      dispatch(fetchCart({ userId: user.userId, token }));
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };
  const handleProfileClick = () => {
    navigate(`/profile`);  
  };

  useEffect(() => {
    if (user && token) {
      dispatch(fetchCart({ userId: user.userId, token }));
    }
  }, [user, token, dispatch]);

  const cartItemCount = cart?.cartItems?.length || 0;

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <nav className="mx-auto flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Moon Flower</span>
            <img
              alt="Logo"
              src="/src/assets/logo-shop.png"
              className="h-12 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-Color"
          >
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">

          <Popover className="relative group">
            <PopoverButton className="flex items-center gap-x-1 font-sans text-Color group-hover:text-red-500">
              Lan Hồ Điệp
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 text-Color group-hover:text-red-500"
              />
            </PopoverButton>
            <PopoverPanel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                  >
                    {item.image && (
                      <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-lg bg-gray-50 group-hover:bg-white">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-auto">
                      <Link
                        to={item.href}
                        className="block font-semibold text-Color hover:text-red-500"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 italic text-Color">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Link
            to="/category/4"
            className="font-sans text-Color hover:text-red-500"
          >
            Hoa Sinh Nhật
          </Link>
          <Link
            to="/category/5"
            className="font-sans text-Color hover:text-red-500"
          >
            Hoa Giá Rẻ
          </Link>
          <Link
            to="/category/9"
            className="font-sans text-Color hover:text-red-500"
          >
            Hoa Khai Trương
          </Link>
        </PopoverGroup>

        
        <div className="hidden lg:flex items-center justify-center ml-4 w-1/4">

          <div className="flex items-center justify-center border border-gray-300 rounded-3xl p-2">
            <input type="text" placeholder="Tìm kiếm" className="w-full outline-none" />
            <button className=" text-white rounded-3xl">
            <IoSearchOutline className="h-6 w-6 text-Color hover:text-red-500" />
          </button>
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-8">
        {user && (
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
        )}

          {user ? (
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-x-2">
                <img
                  src={user.avatar || "/assets/default-avatar.jpg"}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full"
                />
              </PopoverButton>
              <PopoverPanel className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-900/5">
                <div className="p-4">
                  <button onClick={handleProfileClick} className="block py-2 text-Color hover:text-red-500">
                    Trang cá nhân
                  </button>
                  <Link to="/orders" className="block py-2 text-Color hover:text-red-500">
                    Đơn hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-Color hover:text-red-500"
                  >
                    Đăng xuất
                  </button>
                </div>
              </PopoverPanel>
            </Popover>
          ) : (
            <Link to="/login" className="font-sans text-Color hover:text-red-500">
              Đăng Nhập
            </Link>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 pt-12 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <img
                alt="Logo"
                src="/src/assets/logo-shop.png"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-Color"
            >
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div">
                  <DisclosureButton className="group flex w-full items-center justify-between py-2 pl-3 pr-3.5 text-base text-Color hover:bg-gray-50">
                    Lan Hồ Điệp
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {products.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block py-2 pl-6 pr-3 text-Color hover:text-red-500"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Link
                  to="/category/4"
                  className="block px-3 py-2 text-base text-Color hover:text-red-500"
                >
                  Hoa Sinh Nhật
                </Link>
                <Link
                  to="/category/5"
                  className="block px-3 py-2 text-base text-Color hover:text-red-500"
                >
                  Hoa Giá Rẻ
                </Link>
                <Link
                  to="/category/9"
                  className="block px-3 py-2 text-base text-Color hover:text-red-500"
                >
                  Hoa Khai Trương
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <IoSearchOutline className="h-6 w-6 text-Color hover:text-red-500" />
              </div>
              <div className="py-6">
                <Link
                  to="/login"
                  className="block px-3 py-2.5 text-base text-Color hover:text-red-500"
                >
                  Đăng Nhập
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
