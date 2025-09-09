/* eslint-disable max-len */
import React, { Fragment, useEffect, useState } from 'react';
import { Accessory } from '../../types/Accessory';
import { Phone } from '../../types/Phone';
import { Product } from '../../types/Product';

import { Tablet } from '../../types/Tablet';
import { Link, useLocation } from 'react-router-dom';
import { useCartValues } from '../../store/CartStore';
import { useFavouriteValues } from '../../store/FavouriteContext';
import { GoBackBttn } from '../GoBackBttn';
import classNames from 'classnames';
import { getImageUrl } from '../../utils/getImageUrl';
import { COLOR_TO_SELECT } from '../../types/ChooseColor';

type Props = {
  selectedProduct: Phone | Tablet | Accessory | undefined;
  productId: string | undefined;
};

type SpecItem = {
  name: string;
  value: string | number | string[] | undefined;
};

export const ProductDescription: React.FC<Props> = ({
  selectedProduct,
  productId,
}) => {
  const name = selectedProduct?.name;
  const mainImage = selectedProduct?.images?.[0];
  const mainColor = selectedProduct?.color;
  const mainCapacity = selectedProduct?.capacity;
  const colors = selectedProduct?.colorsAvailable;
  const capacityAvailable = selectedProduct?.capacityAvailable;
  const price = selectedProduct?.priceDiscount;
  const fullPrice = selectedProduct?.priceRegular;
  const description = selectedProduct?.description;
  const screen = selectedProduct?.screen;
  const resolution = selectedProduct?.resolution;
  const processor = selectedProduct?.processor;
  const ram = selectedProduct?.ram;
  const camera = selectedProduct?.camera;
  const zoom = selectedProduct?.zoom;
  const cell = selectedProduct?.cell;
  const location = useLocation();
  const root = location.pathname.split('/')[1];

  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [selectedColor, setSelectedColor] = useState(mainColor);
  const [selectedCapacity, setSelectedCapacity] = useState(mainCapacity);

  const { addToCart, removeFromCart, cart } = useCartValues();
  const { addToFavourite, removeFromFavourite, favourites } =
    useFavouriteValues();

  const handleChangeProductsColor = (newColor: string) => {
    if (!colors || !productId) {
      return '';
    }

    const formattedColor = newColor.replace(/\s+/g, '-').toLowerCase();
    const knownColors = colors.map(c => c.replace(/\s+/g, '-').toLowerCase());
    const parts = productId.split('-');

    const colorIndex = parts.findIndex((_, i) =>
      knownColors.includes(parts.slice(i).join('-')),
    );

    const baseParts = colorIndex !== -1 ? parts.slice(0, colorIndex) : parts;

    return [...baseParts, formattedColor].join('-');
  };

  const handleChangeProductsCapacity = (newCapacity: string) => {
    const parts = productId?.split('-').slice(0, -2) || [];
    const updatedCapacity = [...parts, newCapacity, selectedColor].join('-');

    return updatedCapacity;
  };

  const selectedItemId = selectedProduct?.itemId || selectedProduct?.id;

  const isAddedToCart = cart.some(
    item =>
      item.product &&
      String(item.product.itemId || item.product.id) === String(selectedItemId),
  );

  const isAddedToFavourites = favourites.some(
    item =>
      item.product &&
      String(item.product.itemId || item.product.id) === String(selectedItemId),
  );

  useEffect(() => {
    setSelectedImage(mainImage);
    setSelectedColor(mainColor);
    setSelectedCapacity(mainCapacity);
  }, [mainImage, mainColor, mainCapacity]);

  const renderSpecs = (specs: SpecItem[]) => (
    <ul className="product-description__description">
      {specs.map((spec, index) => (
        <li
          key={`${spec.name}-${index}`}
          className="product-description__description__item"
        >
          <span className="product-description__description__item--name">
            {spec.name}
          </span>
          <span className="product-description__description__item--value">
            {Array.isArray(spec.value) ? spec.value.join(', ') : spec.value}
          </span>
        </li>
      ))}
    </ul>
  );

  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://andriana1112.github.io/phone-catalog_react'
    : '';

  const imageSrc = selectedProduct?.image
    ? `${baseUrl}/${selectedProduct.image}`
    : selectedImage
      ? `${baseUrl}/${selectedImage}`
      : `${baseUrl}/img/page-not-found.png`;

  const shortSpecs: SpecItem[] = [
    { name: 'Screen', value: screen },
    { name: 'Resolution', value: resolution },
    { name: 'Processor', value: processor },
    { name: 'RAM', value: ram },
  ];

  const fullSpecs: SpecItem[] = [
    { name: 'Screen', value: screen },
    { name: 'Resolution', value: resolution },
    { name: 'Processor', value: processor },
    { name: 'RAM', value: ram },
    { name: 'Built in memory', value: mainCapacity },
    ...(camera ? [{ name: 'Camera', value: camera }] : []),
    ...(zoom ? [{ name: 'Zoom', value: zoom }] : []),
    { name: 'Cell', value: cell },
  ];

  React.useEffect(() => {}, [selectedProduct]);

  return (
    <>
      <GoBackBttn />
      <div className="product-description">
        <h2 className="product-description__title">{name}</h2>
        <div className="container_first">
          <div className="product-description__images">
            <img
              src={imageSrc}
              alt=""
              className="product-description__main-image"
            />
            <div className="product-description__miniatures">
              {Array.isArray(selectedProduct?.images) &&
                selectedProduct.images.map(image => (
                  <div
                    key={image}
                    onClick={() => setSelectedImage(image)}
                    className={classNames(
                      'product-description__miniatures-container',
                      {
                        'product-description__miniatures-containerActive':
                          selectedImage === image,
                      },
                    )}
                  >
                    <img
                      src={`${baseUrl}/${image}`}
                      alt={selectedProduct.id}
                      className="product-description__miniature-image"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="product-description__order">
            <div className="product-description__top-text">
              <p className="product-description__top-text--text">
                Available color
              </p>
              <p className="product-description__top-text--textId">
                ID: 802390
              </p>
            </div>
            <div className="product-description__colorList">
              {colors?.map(color => (
                <Link
                  to={`/${root}/${handleChangeProductsColor(color)}`}
                  key={color}
                >
                  <div
                    className={classNames('product-description__color', {
                      'product-description__colorActive':
                        color === selectedColor,
                    })}
                    style={{ backgroundColor: COLOR_TO_SELECT[color] }}
                    onClick={() => setSelectedColor(color)}
                  ></div>
                </Link>
              ))}
            </div>

            <hr className="product-description__divider" />

            <div className="product-description__capacitySection">
              <p className="product-description__capacitySection--text">
                Select capacity
              </p>
              <div className="product-description__capacityList">
                {capacityAvailable?.map(capacity => (
                  <Link
                    to={`/${root}/${handleChangeProductsCapacity(capacity.toLowerCase())}`}
                    key={capacity}
                  >
                    <div
                      className={classNames('product-description__capacity', {
                        'product-description__capacityActive':
                          selectedCapacity === capacity,
                      })}
                    >
                      {capacity.replace(/(\d+)(GB)/, '$1 $2')}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <hr className="product-description__divider" />
            <div className="product-description__prices">
              <h2 className="product-description__prices--price">${price}</h2>
              <p className="product-description__prices--fullprice">
                ${fullPrice}
              </p>
            </div>
            <div className="product-description__actions">
              {!isAddedToCart ? (
                <button
                  type="button"
                  className="product-description__actions--btn product-description__add"
                  onClick={() => {
                    if (selectedProduct) {
                      addToCart(selectedProduct as unknown as Product);
                    }
                  }}
                  disabled={!selectedProduct}
                >
                  Add to cart
                </button>
              ) : (
                <button
                  type="button"
                  className="product-description__actions--btn product-description__added"
                  onClick={() => {
                    if (selectedProduct) {
                      removeFromCart(selectedProduct as unknown as Product);
                    }
                  }}
                >
                  Added
                </button>
              )}

              {isAddedToFavourites ? (
                <button
                  type="button"
                  className="product-description__action-btn product-description__favourite"
                  onClick={() => {
                    if (selectedProduct) {
                      removeFromFavourite(
                        selectedProduct as unknown as Product,
                      );
                    }
                  }}
                >
                  <div className="icon-wrapper">
                    <img
                      src={getImageUrl("/img/favourite-icon-selected.png")}
                      alt="favourite icon"
                      className="icon icon-user favourite__added"
                    />
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  className="product-description__action-btn product-description__favourite"
                  onClick={() => {
                    if (selectedProduct) {
                      addToFavourite(selectedProduct as unknown as Product);
                    }
                  }}
                >
                  <div className="icon-wrapper">
                    <img
                      src={getImageUrl("/img/favourite-icon.png")}
                      alt="favourite icon"
                      className="icon icon-user"
                    />
                  </div>
                </button>
              )}
            </div>
            {renderSpecs(shortSpecs)}
          </div>
        </div>
        <div className="container_second">
          <div className="product-description__about">
            <h3 className="product-description__about--title">About</h3>

            <hr className="product-description__divider" />

            {description?.map(desc => (
              <Fragment key={`${desc.title}-${desc.text}`}>
                <h4 className="product-description__about--title-mini">
                  {desc.title}
                </h4>
                <p className="product-description__about--text">{desc.text}</p>
              </Fragment>
            ))}
          </div>
          <div className="product-description__tech-specs">
            <h3 className="product-description__tech-specs--title">
              Tech specs
            </h3>

            <hr className="product-description__divider" />

            {renderSpecs(fullSpecs)}
          </div>
        </div>
      </div>
    </>
  );
};
