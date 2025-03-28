import React from 'react';

const Dashboard = () => {
  return (
    <div className="w-full flex overflow-auto min-h-screen items-center flex-col">
      <div className="w-full h-[1024px] flex overflow-hidden relative items-start flex-shrink-0 bg-white">
        
        {/* Header Section */}
        <header className="absolute top-[38px] left-[-231px] w-[1920px] h-[169px] flex border-b border-gray-200">
          <div className="absolute top-[120px] left-0 w-[1920px] h-[48px] flex bg-white">
            <span className="absolute left-[363.27px] text-[#030712] w-[37px] text-[15px] font-semibold leading-[48px]">Shop</span>
            <img src="/external/svg21016-yg7a.svg" alt="SVG21016" className="absolute top-[48.5px] left-[406.5px] w-[10px] h-[48px]" />
            <span className="absolute left-[441.33px] text-[#030712] w-[135px] text-[15px] font-semibold leading-[48px]">Fruits & Vegetables</span>
            <span className="absolute left-[722px] text-[#030712] w-[56px] text-[15px] font-semibold leading-[48px]">Contact</span>
            <span className="absolute left-[280px] text-[#030712] w-[42px] text-[15px] font-semibold leading-[48px]">Home</span>
            <img src="/external/svg216111-y2jp.svg" alt="SVG216111" className="absolute top-[48.5px] left-[328.44px] w-[10px] h-[48px]" />
            <span className="absolute left-[1289.19px] text-[#030712] w-[129px] text-[15px] font-semibold leading-[48px]">Trending Products</span>
            <img src="/external/svg218114-ivt.svg" alt="SVG218114" className="absolute top-[48.5px] left-[1427.83px] w-[10px] h-[48px]" />
            <span className="absolute left-[1462.66px] text-[#DC2626] w-[112px] text-[15px] font-semibold leading-[48px]">Almost Finished</span>
            <div className="absolute top-[14.5px] left-[1582.7px] w-[37px] h-[20px] flex bg-gradient-to-r from-[#DC2626] to-[#EA580C] rounded">
              <span className="absolute top-[4px] left-[6.5px] text-white w-[25px] text-[10px] font-bold leading-[10px] text-center">SALE</span>
            </div>
            <img src="/external/svg221119-it5.svg" alt="SVG221119" className="absolute top-[48.5px] left-[1630.17px] w-[10px] h-[48px]" />
          </div>
        </header>
        
        {/* Hero Section */}
        <div className="absolute top-[221px] left-[-9px] w-[1447px] h-[560px] flex overflow-hidden">
          <div className="absolute top-0 left-[1px] w-[1445px] h-[560px] flex overflow-hidden rounded-md bg-white">
            <div className="absolute top-[101.41px] left-[80px] w-[600px] h-[357.17px] flex">
              <div className="absolute top-0 left-0 w-[124px] h-[28px] flex bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-md">
                <span className="absolute top-[6px] left-[10px] text-[#166534] w-[104px] text-[12px] font-semibold leading-[18px]">Weekend Discount</span>
              </div>
              <span className="absolute top-[39px] text-[#39245F] w-[497px] text-[48px] font-bold leading-[62.4px]">
                Get the best quality<br />products at the lowest<br />prices
              </span>
              <span className="absolute top-[233.17px] text-[#030712] w-[470px] text-[16px]">
                We have prepared special discounts for you on organic breakfast
              </span>
              <span className="absolute top-[253.17px] text-[#030712] w-[69px] text-[16px]">products.</span>
              <div className="absolute top-[314.17px] left-0 w-[134px] h-[42px] flex bg-[#634C9F] rounded-lg">
                <span className="absolute top-[12px] left-[18px] text-white w-[67px] text-[14px] font-bold leading-[42px] text-center">Shop Now</span>
              </div>
              <span className="absolute top-[318.59px] left-[232px] text-[#111827] w-[102px] text-[19.6px] font-bold leading-[19.6px] line-through">
                ₹ 59.99
              </span>
              <span className="absolute top-[314.59px] left-[150px] text-[#DC2626] w-[196px] text-[28px] font-bold leading-[28px]">
                ₹ 21.67
              </span>
            </div>
          </div>
        </div>
        
        {/* Categories Section */}
        <span className="absolute top-[795px] left-[63px] text-[#030712] w-[143px] text-[18px] font-bold">Top Categories</span>
        <span className="absolute top-[795px] left-[257px] text-[#9CA3AF] w-[230px] text-[13px]">
          New products with updated stocks.
        </span>
        <div className="absolute top-[840px] left-[173px] w-[1360px] h-[183.59px] flex overflow-hidden">
          <img src="/external/list011102-tcl-200h.png" alt="list011102" className="absolute top-[25.06px] left-[290.06px] w-[116px] h-[116px] rounded-full" />
          <span className="absolute top-[129px] left-[1.66px] text-[#030712] w-[119px] text-[13px] font-bold leading-[15.6px] text-center">
            Fruits & Vegetables
          </span>
          <img src="/external/list251106-l4f-200h.png" alt="list251106" className="absolute top-[25.06px] left-[810.06px] w-[116px] h-[116px] rounded-full" />
          <span className="absolute top-[151px] left-[813.14px] text-[#030712] w-[110px] text-[13px] font-bold leading-[15.6px] text-center">
            Grocery & Staples
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
