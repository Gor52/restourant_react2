import React from 'react';
import { useTheme } from '/src/contexts/ThemeContext';
import ProductCard from '/src/components/ProductCard';
import '/src/pages/MenuPage.css';

const MenuPage = () => {
  const { theme } = useTheme();
  
  const products = [
    {
      id: 1,
      name: "Хашлама",
      price: 890,
      image: "https://avatars.mds.yandex.net/i?id=b45fc3ededf2540c8473da46cdd077b6_l-8220238-images-thumbs&n=13"
    },
    {
      id: 2,
      name: "Хоровац",
      price: 950,
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Garni_-_Armenia_%282912078422%29.jpg"
    },
    {
      id: 3,
      name: "Толма",
      price: 780,
      image: "https://belovanadi.ru/wp-content/uploads/2025/01/76.webp"
    },
    {
      id: 4,
      name: "Ламаджо",
      price: 450,
      image: "https://www.u-gago.ru/images/product_images/original_images/242_0.jpg"
    },
    {
      id: 5,
      name: "Ариса",
      price: 680,
      image: "https://pic.rutubelist.ru/video/2025-05-25/67/01/6701375b9053e3bdc179a40e36361225.jpg"
    },
    {
      id: 6,
      name: "Гата",
      price: 320,
      image: "https://yandex-images.clstorage.net/DZ5nz1217/4ccc5eOyX/nLL6m5SldL1_Hzn9soup20SOvtaVnFA8czf_JhXLaJlabPs7GvbBxIu16rbBje79MYNjREhr_YHntIyFLjjk_tGjv6rRrA2hfwto0Zu7wesE246jmclYWGMqmxdNO514vuweyoJaTAV7xffqxZTagBi2xugFUkxJ1slQXcZtwY9Q_k5z8DWx5QunSG0-S1EXCENWrk3xoA2n-0qGTYOxVBLgwiaOvuD1E-E7SrW4f-g01qLdybIUVVrlDJXuvUVviAqWBxTJ7cXjAyRdFsPRT0y3AkLhGfw5ZzvOzilfabyyyLpKVt70GX8NM7a9KH-c4KoOWdky7EEiTRC5Xt1hizxG1i90PZXRi5-czQo7qQsIZ8I6Ld0oWQs_hk4pa92k4qjWJsbK1MXzndfWdTAjoOx-KonJtvyVtk18CXZJCXfU-prPdD0pDQdnxH22A8GTbDtKts35BP3TJ1aetYO5JLKsLvIq3kA1kxF32vVk3xDELiqljb5E-V7JkEVGDekHhHoWqzyl4UHfV7zlPqtN39RPYsrRFSTFs1t6dhUfpTg-pPbuHq74wcvly859VHcQGMomcZk2EMnS2XBp2j19lwBGts-8NSUtG0MQrUaDBZ_oIxpiEWHETSsz_nKp49kcrqyyVory3EH_tT_m5ZzbIAxeislljozxIlkALQIRZW-wKhrvOAWZCZfHzIneh5nrNM--ChXZsLVDJ6pmMfepXAo4ZvIK9uwp47kbepnoM1BYqtKdTXK4cWohCOnKqY1v2AKaQ1QFXZVnM9AhBjMlE_TjYrqpyWRxn3uucl0T3UymNHa6kl4whWtpV8YdWP_gmGay9QF6POGq9XjZ2pkxG7gyNpOEad1tj7-89fJDnavEv5ZyWXFw8QcPXmK9F83ktgBa4grqnO2TSVu2ARTfoLjSdjHd-gyFRrGAWWKNgTOEPtpzVKGNEVPb0PV2BwH7YMNaCrEdCD1fQ34WJXew"
    }
  ];

  return (
    <div className={`menu-page ${theme}`}>
      <h2>Меню блюд</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;