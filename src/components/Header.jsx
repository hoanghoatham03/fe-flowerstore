
import { useState } from 'react'
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import { DevicePhoneMobileIcon,Bars3Icon, XMarkIcon, ChevronDownIcon, PhoneIcon,  } from '@heroicons/react/24/outline'

const products = [
  { name: 'LAN HỒ ĐIỆP MINI', description: 'Món quà nhỏ xinh, ý nghĩa lớn', href: 'category/11',image: '/assets/hoachucmung.webp' },
  { name: 'CHẬU LAN HỒ ĐIỆP 3 CÀNH', description: 'Sang trọng và đầy sức sống', href: '/category/12', image: '/assets/hoasinhnhat.webp'},
  { name: 'CHẬU LAN HỒ ĐIỆP 5 CÀNH', description: 'Tỏa sáng với phong cách riêng', href: '/category/13', image: '/assets/hoatinhyeu.webp'},
  { name: 'CHẬU LAN HỒ ĐIỆP 10 CÀNH', description: 'Đẳng cấp và phú quý', href: '/category/14', image: '/assets/lanhodiep.webp'},
]

const callsToAction = [
  { name: 'Zalo', href: 'https://zalo.me', icon: PhoneIcon },
  { name: 'Điện Thoại', href: '19001783', icon: DevicePhoneMobileIcon},
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <nav className="mx-auto flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Moon Flower</span>
            <img alt="Logo" src="/src/assets/logo-shop.png" className="h-12 w-auto" />
          </a>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-Color"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 font-sans text-Color">
              Lan Hồ Điệp
              <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-Color" />
            </PopoverButton>

            <PopoverPanel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                {products.map((item) => (
                  <div key={item.name} className="group relative flex items-center gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                    {item.image ? (
                      <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-lg bg-gray-50 group-hover:bg-white">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="flex-auto">
                      <a href={item.href} className="block font-semibold text-Color">
                        {item.name}
                      </a>
                      <p className="mt-1 text-Color">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>

          </Popover>

          <a href="/category/4" className=" font-sans text-Color">
            Hoa Sinh Nhật
          </a>
          <a href="/category/5" className=" font-sans text-Color">
            Hoa Giá Rẻ
          </a>
          <a href="/category/9" className=" font-sans text-Color">
            Hoa Khai Trương
          </a>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/login" className=" font-sans text-Color">
            Đăng Nhập
          </a>
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 pt-12 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Moon Flower</span>
              <img alt="Logo" src="/src/assets/logo-shop.png" className="h-8 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-Color"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div">
                  <DisclosureButton className="group flex w-full items-center justify-between py-2 pl-3 pr-3.5 text-base text-Color hover:bg-gray-50">
                    Lan Hồ Điệp
                    <ChevronDownIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block py-2 pl-6 pr-3  text-Color hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a href="/category/4" className="block px-3 py-2 text-base text-Color hover:bg-gray-50">Hoa Sinh Nhật</a>
                <a href="/category/5" className="block px-3 py-2 text-base text-Color hover:bg-gray-50">Hoa Giá Rẻ</a>
                <a href="/category/9" className="block px-3 py-2 text-base text-Color hover:bg-gray-50">Hoa Khai Trương</a>
              </div>
              <div className="py-6">
                <a href="/login" className="block px-3 py-2.5 text-base text-Color hover:bg-gray-50">Đăng Nhập</a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
