import React from 'react';
import { Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import QuantityCart from '../components/QuantityCart';

class Cart extends React.Component {
  state = {
    productList: [],
    productListReduced: [],
    empty: true,
    redirect: false,
  };

  componentDidMount() {
    this.getLocalStorageList();
  }

  getLocalStorageList = () => {
    const productList = JSON.parse(localStorage.getItem('productId'));
    if (productList) {
      this.setState({ productList }, () => {
        // Referência: https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
        const arr = productList;
        const newArr = arr.reduce((acc, current) => {
          const singleItem = acc.find((item) => item.id === current.id);
          if (!singleItem) {
            return acc.concat([current]);
          }
          return acc;
        }, []);
        this.setState({
          productListReduced: newArr,
          empty: false,
        });
      });
    }
  }

  handleQuantity = (id, change) => {
    if (change) {
      const { productList } = this.state;
      const productAdd = productList.find((item) => item.id === id);
      const arr = [...productList];
      arr.push(productAdd);
      return this.setState({ productList: arr }, () => {
        localStorage.setItem('productId', JSON.stringify(arr));
      });
    }
    const { productList } = this.state;
    const arrayItems = productList.filter((item) => item.id === id);
    arrayItems.shift();
    const arrayWithouItem = productList.filter((item) => item.id !== id);
    const arr = [...arrayWithouItem, ...arrayItems];
    this.setState({ productList: arr }, () => {
      localStorage.setItem('productId', JSON.stringify(arr));
    });
  }

  handleBtnCheckout = () => {
    this.setState({
      redirect: true,
    });
  }

  render() {
    const { productList, productListReduced, empty, redirect } = this.state;
    if (redirect) {
      return (
        <Redirect to="/checkout" />
      );
    }
    return (
      <>
        <div className="main-content">
          <Header storageList={ productList } />
          <section className="cards-content-buy">
            {!empty ? (
              productListReduced.map((product) => (
                <section key={ product.id } className="product-cart">
                  <h1 data-testid="shopping-cart-product-quantity">
                    {
                      productList
                        .filter((item) => item.id === product.id)
                        .length <= 0 ? 1 : productList
                          .filter((item) => item.id === product.id)
                          .length
                    }
                    {' unidades'}
                  </h1>
                  <div data-testid="product" className="productInfos">
                    <img
                      style={ { width: '30%' } }
                      src={ product.thumbnail }
                      alt={ product.title }
                    />
                    <h4>
                      Preço:
                      { product.price }
                    </h4>
                    <p data-testid="shopping-cart-product-name">{ product.title }</p>
                  </div>
                  <QuantityCart
                    quantityProduct={ productList
                      .filter((item) => item.id === product.id)
                      .length <= 0 ? 1 : productList
                        .filter((item) => item.id === product.id)
                        .length }
                    max={ productList
                      .filter((item) => item.id === product.id)
                      .length === product.available_quantity && 'max' }
                    id={ product.id }
                    handleQuantity={ this.handleQuantity }
                  />
                </section>
              )))
              : (
                <p data-testid="shopping-cart-empty-message">
                  Seu carrinho está vazio
                </p>
              )}
          </section>
          <button
            data-testid="checkout-products"
            type="button"
            className="btnCardCheckout"
            onClick={ this.handleBtnCheckout }
          >
            Finalizar compra
            {productList && (
              <h2
                data-testid="shopping-cart-size"
              >
                {productList.length}

              </h2>
            )}

          </button>
        </div>
        <Footer />
      </>
    );
  }
}

export default Cart;
