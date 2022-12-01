document.addEventListener("DOMContentLoaded", function () {

  //allows only one checkbox to be checked (modal-order)
  document.querySelectorAll('.js-check-only-one').forEach(function (item) {
    item.addEventListener('change', function () {
      let targetItem = item;
      let group = document.querySelectorAll('[name=' + this.getAttribute('name') + ']');
      group.forEach(function (groupItem) {
        if (targetItem != groupItem) {
          groupItem.checked = false;
        }
      })
    })
  })

  //remove item from order (cart.html)
  document.querySelectorAll('.order-table__btn_remove').forEach(function (item) {
    item.addEventListener('click', function () {
      this.closest('.order-table__row').remove();
      orderItems = document.querySelectorAll('.order-table__row');
      if (document.querySelector('.js-calc-cart')) {
        calcCartCost();
      }
      if (orderItems.length <= 2) {
        window.location.href = "/";
      }
    })
  })

  //Recommend slider start
  //disables buttons
  document.querySelectorAll('.menu-list-scroll__outer').forEach(function (item) {
    item.addEventListener('scroll', function () {
      let scrollWidth = this.scrollWidth;
      let scrollPosition = this.scrollLeft;
      let containerWidth = this.offsetWidth;
      let btnPrev = item.parentNode.querySelector('.menu-list-scroll__arrow_prev');
      let btnNext = item.parentNode.querySelector('.menu-list-scroll__arrow_next');
      if (scrollWidth <= containerWidth) {
        btnPrev.classList.add('_disabled');
        btnNext.classList.add('_disabled');
      } else {
        if (containerWidth + scrollPosition >= scrollWidth) {
          btnNext.classList.add('_disabled');
        } else {
          btnNext.classList.remove('_disabled');
        }
        if (scrollPosition <= 0) {
          btnPrev.classList.add('_disabled');
        } else {
          btnPrev.classList.remove('_disabled');
        }
      }
    })
  })
  var intFrameWidth = window.innerWidth;
  window.addEventListener('resize', function (event) {
    intFrameWidth = window.innerWidth;
    //calc slider width
    if (intFrameWidth >= 992) {
      document.querySelectorAll('.menu-list-scroll__inner').forEach(function (item) {
        item.style.width = '100%';
      })
    } else {
      document.querySelectorAll('.menu-list-scroll__inner').forEach(function (item) {
        let size = item.querySelectorAll('.card-item').length / 2;
        size = size < 1 ? 1 : size;
        item.style.width = 'calc(' + size * 100 + '% + ' + (size - 1) * 20 + 'px';
      })
    }
  });
  window.dispatchEvent(new Event('resize'));
  //scrolls "Recommend" slider to the next 
  document.querySelectorAll('.menu-list-scroll__arrow_next').forEach(function (item) {
    item.addEventListener('click', function () {
      let container = this.closest('.menu-list-scroll').querySelector('.menu-list-scroll__outer');
      let scrollSize = container.offsetWidth;
      container.scrollLeft = container.scrollLeft + scrollSize + 20;
    })
  })
  //scrolls "Recommend" slider to the previous 
  document.querySelectorAll('.menu-list-scroll__arrow_prev').forEach(function (item) {
    item.addEventListener('click', function () {
      let container = this.closest('.menu-list-scroll').querySelector('.menu-list-scroll__outer');
      let scrollSize = container.offsetWidth;
      container.scrollLeft = container.scrollLeft - scrollSize - 20;
    })
  })
  //Recommend slider end

  //show counter and price if item chosen (product.html)
  document.querySelectorAll('.js-check-order-item').forEach(function (item) {
    item.addEventListener('change', function () {
      if (this.checked) {
        this.closest('.product-item__row').classList.add('_active');
      } else {
        this.closest('.product-item__row').classList.remove('_active');
      }
    })
  })
  //show counter and price if item chosen
  //on page load
  document.querySelectorAll('.js-check-order-item').forEach(function (item) {
    if (item.checked) {
      item.closest('.product-item__row').classList.add('_active');
    } else {
      item.closest('.product-item__row').classList.remove('_active');
    }
  })

  //accordion (modal-order, product.html)
  document.querySelectorAll('.js-accordion-head').forEach(function (item) {
    item.addEventListener('click', function () {
      let item = this.parentNode;
      if (item.classList.contains('_active')) {
        item.classList.remove("_active");
      } else {
        item.classList.add("_active");
      }
    })
  })

  //increment, decrement order counter
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('input-counter__btn_inc')) {
      let input = e.target.parentNode.querySelector('.input-counter__input-style');
      let max = input.getAttribute('max');
      let value = Number(input.value) + 1;
      if (value > max) {
        value = max
      }
      input.value = value;
      input.dispatchEvent(new Event('input', { 'bubbles': true }));
    };
    if (e.target.classList.contains('input-counter__btn_dec')) {
      let input = e.target.parentNode.querySelector('.input-counter__input-style');
      let min = input.getAttribute('min');
      let value = Number(input.value) - 1;
      if (value < min) {
        value = min
      }
      input.value = value;
      input.dispatchEvent(new Event('input', { 'bubbles': true }));
    };
  });

  //filters counter input
  document.querySelectorAll('.input-counter__input-style').forEach(function (item) {
    item.addEventListener('input', function (event) {
      let regex = /[0-9]|\./;
      var value = this.value;
      if (!regex.test(event.data) && event.data) {
        value = value.slice(0, -1);
      }
      let min = this.getAttribute('min');
      let max = this.getAttribute('max');
      if (Number(value) > max) {
        value = max;
      }
      if (Number(value) < min) {
        value = min;
      }
      this.value = value;
    })
  });

  //calc price (modal-order)
  document.querySelectorAll('.modal-order .input-counter__input-style').forEach(function (item) {
    item.addEventListener('input', function () {
      let total = Number(this.getAttribute('data-price')) * this.value;
      this.closest('.modal-order').querySelector('.btn-add-order__price').textContent = '$' + total.toFixed(2);
    })
  })

  //calc produc cost (product.html)
  //initialize price calculation when changing counter (product.html) 
  document.querySelectorAll('.js-calc-product .input-counter__input-style').forEach(function (item) {
    item.addEventListener('input', function () {
      calcProductCost();
    })
  })
  //initialize price calculation when extras added (product.html) 
  document.querySelectorAll('.js-calc-product .checkbox__input').forEach(function (item) {
    item.addEventListener('change', function () {
      calcProductCost();
    })
  })
  //initialize price calculation on page load (product.html) 
  if (document.querySelector('.js-calc-product')) {
    calcProductCost()
  }
  //calculation product price
  function calcProductCost() {
    let extraItems = document.querySelectorAll('.js-calc-product .product__items .input-counter__input-style');
    let product = document.querySelector('.js-calc-product .product__footer .input-counter__input-style');
    let costExtras = 0;

    extraItems.forEach(function (inputItem) {
      if (inputItem.closest('.product-item__row').classList.contains('_active')) {
        let itemPrice = Number(inputItem.getAttribute('data-price'));
        let itemCount = inputItem.value;
        costExtras += itemPrice * itemCount;
      }
    })
    let productPrice = Number(product.getAttribute('data-price'));
    let productCount = product.value;
    let productAndExtras = productPrice + costExtras;
    let total = productAndExtras * productCount;

    let productPriceBtn = document.querySelector('.js-calc-product .btn-add-order__price');
    productPriceBtn.textContent = '$' + total.toFixed(2);
  };

  //calculation cart cost (cart.html)
  //initialize price calculation when changing counter (cart.html) 
  document.querySelectorAll('.js-calc-cart .input-counter__input-style').forEach(function (item) {
    item.addEventListener('input', function () {
      calcCartCost();
    })
  })
  //Мои писания===================

  let orderAddTipButtons = document.querySelectorAll('.order-add-tip__button');
  let orderAddTipInput = document.querySelector('._order-add-tip__input');

  if (document.querySelector('.order-add-tip__button')) {
      for (let i = 0; i < orderAddTipButtons.length; i++) {
        let orderAddTipButton = orderAddTipButtons[i];

        orderAddTipButton.addEventListener('click', function () {
            for (let i = 0; i < orderAddTipButtons.length; i++) {
              orderAddTipButtons[i].classList.remove('_active');
              if (orderAddTipButtons[i].classList.contains('order-add-tip__button_input') && !(orderAddTipButtons[i] == orderAddTipButton)) {
                  orderAddTipInput.value = "";
              }
            }
            /*if(orderAddTipButton.classList.contains('order-add-tip__button_input') && orderAddTipButton.value) {
              
            } else if (!orderAddTipButton.classList.contains('order-add-tip__button_input')) {
              orderAddTipButton.classList.add('_active');
            }*/
            orderAddTipButton.classList.add('_active');
            //alert(tipCalculation());
            calcCartCost();
        });
      }
      orderAddTipInput.addEventListener('focusout', function (event) { 
      // Здесь можно написать код, который должен будет выполняться при снятии фокуса с формы 
          if (!orderAddTipInput.value) {
              orderAddTipButtons[0].classList.add('_active');
              let orderAddTipInputWrapper = document.querySelector('.order-add-tip__button_input');
              orderAddTipInputWrapper.classList.remove('_active');
              orderAddTipInput.value = "";
              calcCartCost();
          } else if (orderAddTipInput.value) {
              let orderAddTipInputNumber = +orderAddTipInput.value;
              //alert(orderAddTipInputNumber);
              let orderAddTipInputWrapper = document.querySelector('.order-add-tip__button_input');
              if (!orderAddTipInputWrapper.classList.contains('_active')) {
                  orderAddTipInput.value = "";
              } else if (orderAddTipInputNumber > 100) {
                  orderAddTipInput.value = 100;
              } else if (orderAddTipInputNumber < 1) {
                  orderAddTipInput.value = 1;
              }
              calcCartCost();
              //alert(orderAddTipInput.value);
              //alert(orderAddTipInputNumber);
          }
      });
  }

  function tipCalculation() {
      let orderAddTipButtons = document.querySelectorAll('.order-add-tip__button');

      for (let i = 0; i < orderAddTipButtons.length; i++) {
        if (orderAddTipButtons[i].classList.contains('_active')) {
          if (orderAddTipButtons[i].classList.contains('order-add-tip__button_input')) {
            //alert("k");
            let orderAddTipButton = orderAddTipButtons[i];
            let orderAddTipValue = orderAddTipButton.querySelector('._order-add-tip__input').value;
            return (1 + (+orderAddTipValue / 100));
          } else {
            let orderAddTipButton = orderAddTipButtons[i];
            let orderAddTipValue = orderAddTipButton.querySelector('._order-add-tip__content').textContent;
            if (!Number(orderAddTipValue[0])) {
              return 1;
            } else {
              let text = orderAddTipValue.slice(0, -1);
              return (1 + (+text / 100));
            }
          }
        }
      }
  }



  //==============================

  //initialize price calculation on page load (calc.html) 
  if (document.querySelector('.js-calc-cart')) {
    calcCartCost()
  }
  //calculation cart cost
  function calcCartCost() {
    let taxRate = 0.05;
    let products = document.querySelectorAll('.js-calc-cart .input-counter__input-style');
    let subTotal = 0;
    products.forEach(function (product) {
      let productRow = product.closest('.order-table__row');
      let priceField = productRow.querySelector('.order-table__price');
      let productPrice = Number(product.getAttribute('data-price'));
      let productCount = product.value;
      let productCost = productPrice * productCount;
      subTotal += productCost;

      priceField.textContent = '$' + productCost.toFixed(2);
    })
    let tax = subTotal * taxRate;
    let total = (subTotal * tipCalculation()) + tax;

    let taxField = document.querySelector('.js-calc-cart .order-table__tax-value');
    let subTotalField = document.querySelector('.js-calc-cart .order-table__total-value');
    let productPriceBtn = document.querySelector('.js-calc-cart .btn-checkout__price');

    taxField.textContent = '$' + tax.toFixed(2);
    subTotalField.textContent = '$' + (subTotal.toFixed(2) * tipCalculation()).toFixed(2);
    productPriceBtn.textContent = '$' + total.toFixed(2);
  };

  //show order panel (at the bottom of the page) 
  document.querySelectorAll('.js-show-order-bar').forEach(function (item) {
    item.addEventListener('click', function () {
      if (document.body.classList.contains('_show-order-bar')) {
        document.body.classList.remove('_show-order-bar');
        document.querySelector('.order-bar').classList.remove('_active');
      } else {
        document.body.classList.add('_show-order-bar');
        document.querySelector('.order-bar').classList.add('_active');
      }
    })
  })

  //hamburger - show menu (☰ > X)
  document.querySelectorAll('.js-btn-menu').forEach(function (item) {
    item.addEventListener('click', function () {
      if (document.body.classList.contains('_show-menu')) {
        document.body.classList.remove('_show-menu');
        document.querySelector('.header-menu').classList.remove('_active');
      } else {
        document.body.classList.add('_show-menu');
        document.querySelector('.header-menu').classList.add('_active');
      }
    })
  })

  //switching tabs
  document.querySelectorAll('.js-tab').forEach(function (item) {
    item.addEventListener('click', function () {
      if (this.classList.contains('_active')) return;

      let tabsBtn = this.closest('.js-tabs');
      tabsBtn.querySelectorAll('.js-tab._active').forEach(function (btn) {
        btn.classList.remove('_active');
      });
      this.classList.add('_active');

      let index = elIndex(this);
      let tabsContent = tabsBtn.nextElementSibling;
      tabsContent.querySelectorAll('.js-tab-content._active').forEach(function (tab) {
        tab.classList.remove('_active');
      });
      tabsContent.querySelectorAll('.js-tab-content')[index].classList.add('_active');
    })
  })
  //get the index of an element
  function elIndex(el) {
    if (!el) return -1;
    var i = 0;
    while (el = el.previousElementSibling) {
      i++;
    }
    return i;
  }

  //get modal window ID from button, link
  document.querySelectorAll('[data-modal]').forEach(function (item) {
    item.addEventListener('click', function () {
      let modalId = this.getAttribute('href') || this.getAttribute('data-modal');
      if (!modalId) return;
      openModal(modalId.replace("#", ""))
    })
  })
  //show modal window by ID
  function openModal(modalId) {
    document.getElementById(modalId).classList.add('_active')
    document.body.classList.add('show-modal');
  }

  //hide modal window by click
  document.querySelectorAll('.js-modal-hide').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (e.target.classList.contains('js-modal-hide')) {
        let modal = this.closest('.modal');
        let modalID = modal.getAttribute('id');
        closeModal(modalID);
      }
    })
  })
  //close modal window by id or all
  function closeModal(modalId) {
    if (modalId) {
      document.getElementById(modalId).classList.remove('_active')
    } else {
      document.querySelectorAll('.modal._active').forEach(function (item) {
        item.classList.remove('_active')
      })
    }
    document.body.classList.remove('show-modal');
  }

  var popupTime = 3000
  var animationTime = 500;
  //get popup ID from button, link (Item added to your cart)
  document.querySelectorAll('[data-popup]').forEach(function (item) {
    item.addEventListener('click', function () {
      let popupId = this.getAttribute('href') || this.getAttribute('data-popup');
      if (!popupId) return;
      showPopup(popupId.replace("#", ""))
    })
  })
  //show popup (Item added to your cart)
  function showPopup(popupId) {
    let popup = document.getElementById(popupId);
    let popupWrapper = document.querySelector('.popup-wrapper');
    popup.style.transition = animationTime + 'ms';
    popup.style.display = 'block';

    setTimeout(function () {
      popup.style.maxHeight = popup.scrollHeight + 'px';
      popup.classList.add('_active');
      popupWrapper.classList.add('_active');
    }, 10);

    setTimeout(function () {
      popup.style.maxHeight = 0;
      popup.classList.remove('_active');
      setTimeout(function () {
        popup.style.display = 'none';
        popupWrapper.classList.remove('_active');
      }, animationTime);
    }, popupTime)
  }
});