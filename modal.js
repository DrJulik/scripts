const shop = window.location.href.split("https://").pop().split("/")[0];

const fetchCampaignInfo = async () => {
  const res = await fetch(
    `https://easypop.herokuapp.com/api/campaigns/${shop}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const responseJson = await res.json();
  return responseJson.data;
};

const fetchCartInfo = async () => {
  const res = await fetch(`/cart.js`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseJson = await res.json();
  return responseJson;
};

// MUTATION OBSERVER TO WATCH FOR CLASS CHANGES
class ClassWatcher {
  constructor(
    targetNode,
    classToWatch,
    classAddedCallback,
    classRemovedCallback
  ) {
    this.targetNode = targetNode;
    this.classToWatch = classToWatch;
    this.classAddedCallback = classAddedCallback;
    this.classRemovedCallback = classRemovedCallback;
    this.observer = null;
    this.lastClassState = targetNode.classList.contains(this.classToWatch);

    this.init();
  }

  init() {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    this.observer.observe(this.targetNode, { attributes: true });
  }

  disconnect() {
    this.observer.disconnect();
  }

  mutationCallback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        let currentClassState = mutation.target.classList.contains(
          this.classToWatch
        );
        if (this.lastClassState !== currentClassState) {
          this.lastClassState = currentClassState;
          if (currentClassState) {
            this.classAddedCallback();
          } else {
            this.classRemovedCallback();
          }
        }
      }
    }
  };
}

const campaignInfo = async () => {
  try {
    const campData = await fetchCampaignInfo();
    let cartData = await fetchCartInfo();
    console.log(cartData);
    // let cart_size = cartData.item_count;
    // let cart_value = cartData.total_price;
    campData.forEach((campaign) => {
      console.log(campaign);
      const {
        freePlan,
        style,
        content,
        settings,
        _id,
        createdAt,
        name,
      } = campaign;
      const {
        borderColor,
        backgroundColor,
        primaryButtonColor,
        overlayColor,
      } = style;
      const { triggers, triggerMatch } = settings;
      // I GUESS THIS IS WHERE WE BUILD THE CAMPAIGNS
      if (style.campaignType === "modal") {
        // DOM hooks
        const body = document.querySelector("body");
        const modal = document.createElement("section");
        modal.classList.add("ezy-style-modal");

        let link1 = document.createElement("link");
        link1.rel = "stylesheet";
        link1.href =
          "https://cdn.jsdelivr.net/gh/DrJulik/scripts@1.0.942/styles.min.css";
        document.head.appendChild(link1);

        // SET CONTENT TYPES
        const setContentTypes = () => {
          // tw-hidden inside section
          if (content.contentType === "text-image") {
            modal.innerHTML = `
            <!-- TEMPLATE STARTS -->

  <section class="ezy-style-modal__window">
    <section class="ezy-style-modal__close">
      <a href="#" class="closeBtn" title="Close popup modal"">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x ezy-btn--round--clear"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </a>
    </section>
    <section class="ezy-style-modal__content"
      style="
        background-color:${style.backgroundColor};
        border-radius:${style.borderRadius}px">

      <section>
        
<!-- CONTENT -->
<section>
  <div class="tw-flex tw-flex-row tw-flex-wrap tw-justify-center">
    <!-- ##IF IMAGE## -->
    ${
      content.imgUrl !== ""
        ? `<div class="tw-w-full sm:tw-w-1/2"> 
      <div>
        <img class="ezy-style-modal__content__image" src="${content.imgUrl}"/>
      </div>
    </div>`
        : ""
    }
   
    <!-- ##ENDIF## -->
    <div class="tw-w-full sm:tw-w-1/2 tw-max-w-prose tw-flex tw-flex-grow tw-justify-center tw-items-center tw-p-4 tw-md:p-8">
      <div>
        <h3 class="ezy-type__headline--bold-1 tw-mb-2">${content.headline}</h3>
        <p class="tw-mb-4">
        ${content.body}
        </p>
        <a class="ezy-btn tw-w-full" href="${content.buttonUrl}"
          style="
            background-color:${style.primaryButtonColor};
            border-radius:${style.borderRadius}px">${content.buttonText}</a>
      </div>
    </div>
  </div>
</section>
<!-- END CONTENT -->


      </section>

    </section>
  </section>
  <a href="https://brickspacelab.com/" target="_blank" class="ezy-tooltip ezy-tooltip--inverted tw-absolute tw-bottom-2 tw-left-2
    ##IF PAID_PLAN##tw-hidden##ENDIF##">
    ${
      freePlan
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
    <span>Powered by Easypop</span>`
        : ""
    }
    
  </a>

            `;

            body.appendChild(modal);
          } else if (content.contentType === "newsletter") {
            let success;
            let url = window.location.href;
            if (url.includes("?customer_posted=true")) {
              success = "yes";
            } else if (
              url.includes(
                "t?contact%5Btags%5D=prospect%2Cnewsletter&form_type=customer"
              )
            ) {
              success = "no";
            }

            modal.innerHTML = `
            <section class="ezy-style-modal__window">
              <section class="ezy-style-modal__close">
                <a href="#" class="closeBtn" title="Close popup modal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-x ezy-btn--round--clear"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </a>
              </section>
              <section
                class="ezy-style-modal__content"
                style="
                  background-color: ${backgroundColor};
                  border-radius: ${style.borderRadius}px;
                "
              >
              <section>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-justify-center">
                <!-- ##IF IMAGE## -->
                ${
                  content.imgUrl !== ""
                    ? `
                <div class="tw-w-full sm:tw-w-1/2">
                  <div>
                    <img class="ezy-style-modal__content__image" src="${content.imgUrl}" />
                  </div>
                </div>
                <!-- ##ENDIF## -->`
                    : ""
                }
            
                <div
                  class="tw-w-full sm:tw-w-1/2 tw-max-w-prose tw-flex tw-flex-grow tw-justify-center tw-items-center tw-p-4 tw-md:p-8"
                >
                  <div>
                    <h3 class="ezy-type__headline--bold-1 tw-mb-2">
                      ${content.headline}
                    </h3>
                    <p class="tw-mb-4">${content.body}</p>
                    <form
                      method="post"
                      action="/contact#contact_form"
                      id="contact_form"
                      accept-charset="UTF-8"
                      class="contact-form"
                    >
                      <input type="hidden" name="form_type" value="customer" /><input
                        type="hidden"
                        name="utf8"
                        value="✓"
                      />
                      <input
                        id="contact_tags"
                        name="contact[tags]"
                        type="hidden"
                        value="prospect,newsletter"
                      />
            
                      <input
                        class="tw-mb-2"
                        id="contact_email"
                        name="contact[email]"
                        type="email"
                      />
            
                      <input
                        style="
            background-color: ${primaryButtonColor};
            border-radius: ${style.borderRadius}px;
            "
                        class="ezy-btn tw-w-full"
                        type="submit"
                        value="${content.buttonText}"
                      />
                      ${
                        success === "yes"
                          ? `
                      <h3 style="color: green">Thank you for signing up!</h3>
                      `
                          : ""
                      } ${
              success === "no"
                ? `
                      <h3 style="color: red">Please input a valid email!</h3>
                      `
                : ""
            }
                    </form>
                  </div>
                </div>
              </div>
            </section>`;
            body.appendChild(modal);
          } else if (content.contentType === "product-feed") {
            const products = content.selectedProducts[0].selection;
            modal.innerHTML = `
            <!-- TEMPLATE STARTS -->
  <section class="ezy-style-modal__window">
    <section class="ezy-style-modal__close">
      <a href="#" class="closeBtn" title="Close popup modal"">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x ezy-btn--round--clear"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </a>
    </section>
    <section class="ezy-style-modal__content"
      style="
        background-color:${style.backgroundColor};
        border-radius:${style.borderRadius}">

      <section>
        <!-- CONTENT -->
<div class="tw-flex tw-flex-row tw-flex-wrap">
  <div class="tw-w-full sm:tw-w-full tw-flex tw-justify-center tw-items-center">
    <div class="tw-overflow-hidden">
      <div class="tw-p-4 tw-max-w-prose">
        <h3 class="ezy-type__headline--bold-1">${content.headline}</h3>
        <p>
        ${content.body}
        </p>
      </div>
      <div class="ezy-type-productfeed__arrows">
        <div class="ezy-type-productfeed__back">
          <button class="js:ezy-scrollArrowButtons" data-scroll-direction="0" data-scroll-container="ezy-type-productfeed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left ezy-btn--round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
        </div>
        <div class="ezy-type-productfeed__next">
          <button class="js:ezy-scrollArrowButtons" data-scroll-direction="1" data-scroll-container="ezy-type-productfeed">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right ezy-btn--round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
      <div class="ezy-type-productfeed">
        ${products.map((product) => {
          return `
          <div class="ezy-type-productfeed__item">
          <img class="image--square" src=${product.images[0].originalSrc}/>
          <div class="tw-px-2 tw-py-4">
            <p>${product.title}</p>
            <p class="tw-pb-2">$<span class="tw-pb-2 js:ezy-productPrice">${
              product.variants[0].price
            }</span></p>
            <select id="id" name="id" class="ezy-select tw-mb-2 js:ezy-changeVariantSelects">
              ${product.variants.map((variant) => {
                return `<option value="${
                  variant.id
                    .split("gid://shopify/ProductVariant/")
                    .pop()
                    .split("/")[0]
                }" data-variant-availability="${
                  variant.availableForSale
                }" data-variant-price="${variant.price}">${
                  variant.title
                }</option>`;
              })}
            </select>
            <button class="ezy-btn js:ezy-addVariantButtons tw-w-full" data-variant-id="${
              product.variants[0].price
            }">
              <span class="ezy-btn__text">
                Add to cart
              </span>
              <span class="ezy-btn__spinner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
              </button>
            </a>
          </div>
        </div>`;
        })}
      </div>
    </div>
  </div>
</div>
</section>

    </section>
  </section>
  <a href="https://brickspacelab.com/" target="_blank" class="ezy-tooltip ezy-tooltip--inverted tw-absolute tw-bottom-2 tw-left-2
    ##IF PAID_PLAN##tw-hidden##ENDIF##">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
    <span>Powered by Easypop</span>
  </a>
</section>`;

            body.appendChild(modal);
            var ezy = ezy || {};
            ezy.productfeed = {
              // TODO:
              // x create add variant function
              // x show loading icon when adding
              // x add function to scroll left/right
              // x update when selecting variant

              // simple fetch call
              fetch: function (
                requestType,
                url,
                data,
                contentType,
                successCallback,
                errorCallback
              ) {
                fetch(url, {
                  method: requestType,
                  headers: {
                    "Content-Type": contentType,
                    Accept: contentType,
                    "X-Requested-With": "xmlhttprequest",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    successCallback(data);
                  })
                  .catch((error) => {
                    errorCallback(error);
                  });
              },

              // initilize product feed
              init: function () {
                // add variant to cart
                function addVariant(variantID, quantity, callback) {
                  let data = {
                    items: [
                      {
                        id: variantID,
                        quantity: quantity,
                      },
                    ],
                  };
                  ezy.productfeed.fetch(
                    "POST",
                    "/cart/add.js",
                    data,
                    "application/json; charset=utf-8",

                    // success
                    function (data) {
                      console.log(data);
                      if (typeof callback === "function" && callback()) {
                        window.setTimeout(function () {
                          callback();
                        }, 500);
                      }
                    },

                    // error
                    function (error) {
                      if (typeof callback === "function" && callback()) {
                        window.setTimeout(function () {
                          callback();
                        }, 500);
                      }
                    }
                  );
                }

                // scroll container horizontally
                function scrollHorizontally(element, direction) {
                  if (direction == 0) {
                    element.scroll({
                      left: element.scrollLeft - 350,
                      behavior: "smooth",
                    });
                  } else {
                    element.scroll({
                      left: element.scrollLeft + 350,
                      behavior: "smooth",
                    });
                  }
                }

                // toggle loading state of button
                function toggleButton(button) {
                  if (button.classList.contains("ezy-btn--loading")) {
                    button.classList.remove("ezy-btn--loading");
                    button.disabled = false;
                  } else {
                    button.classList.add("ezy-btn--loading");
                    button.disabled = true;
                  }
                }

                // add disabled state to button
                function disableButton(button) {
                  button.classList.add("ezy-btn--disabled");
                  button.disabled = true;
                }

                // add enabled state to button
                function enableButton(button) {
                  button.classList.remove("ezy-btn--disabled");
                  button.disabled = false;
                }

                // listen for click on scroll arrows
                var scrollArrowButtons = document.getElementsByClassName(
                  "js:ezy-scrollArrowButtons"
                );
                Array.from(scrollArrowButtons).forEach(function (
                  scrollArrowButton
                ) {
                  scrollArrowButton.addEventListener("click", function (e) {
                    let scrollContainerClass = this.getAttribute(
                      "data-scroll-container"
                    );
                    let scrollDirection = this.getAttribute(
                      "data-scroll-direction"
                    );
                    var scrollContainers = document.getElementsByClassName(
                      scrollContainerClass
                    );
                    Array.from(scrollContainers).forEach(function (
                      scrollContainer
                    ) {
                      scrollHorizontally(scrollContainer, scrollDirection);
                    });
                  });
                });

                // listen for click on atc
                var addVariantButtons = document.getElementsByClassName(
                  "js:ezy-addVariantButtons"
                );
                Array.from(addVariantButtons).forEach(function (
                  addVariantButton
                ) {
                  addVariantButton.addEventListener("click", function (e) {
                    let variantId = this.getAttribute("data-variant-id");
                    toggleButton(addVariantButton);
                    addVariant(variantId, 1, function () {
                      toggleButton(addVariantButton);
                    });
                  });
                });

                // listen for change to for variant select
                var changeVariantSelects = document.getElementsByClassName(
                  "js:ezy-changeVariantSelects"
                );
                Array.from(changeVariantSelects).forEach(function (
                  changeVariantSelect
                ) {
                  changeVariantSelect.addEventListener("change", function () {
                    let variantAvailability = this.options[
                      this.selectedIndex
                    ].getAttribute("data-variant-availability");
                    let variantPrice = this.options[
                      this.selectedIndex
                    ].getAttribute("data-variant-price");
                    let variantId = this.options[this.selectedIndex].value;
                    let productItem = this.closest(
                      ".ezy-type-productfeed__item"
                    );
                    let button = productItem.getElementsByClassName(
                      "js:ezy-addVariantButtons"
                    )[0];

                    // update variant id in button
                    button.setAttribute("data-variant-id", variantId);

                    // update price in item
                    productItem.getElementsByClassName(
                      "js:ezy-productPrice"
                    )[0].innerHTML = variantPrice;

                    // check availability and update state
                    if (variantAvailability == "true") {
                      enableButton(button);
                    } else {
                      disableButton(button);
                    }
                  });
                  // Create a new 'change' event
                  var event = new Event("change");
                  changeVariantSelect.dispatchEvent(event);
                });
              },
            };
            ezy.productfeed.init();
          } else if (content.contentType === "custom-html") {
            body.appendChild(modal);
          }
        };

        // SETTINGS
        // AUTO CLOSE
        const handleAutoClose = () => {
          if (settings.autoClose) {
            setTimeout(() => {
              modal.classList.remove("open");
              isOpen = false;
            }, settings.autoCloseTime * 1000);
          } else {
            return;
          }
        };

        // Frequency
        const handleFrequency = (id) => {
          // Check if they disabled frequency
          if (!settings.frequency) {
            localStorage.removeItem(`campaign_${id}`);
            localStorage.removeItem(`limit_${id}`);
          }

          let timesShown = 1;

          Date.prototype.addDays = function (days) {
            let date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
          };

          let limitPeriod = parseInt(settings.frequencyPeriod);
          let creationDate = new Date(createdAt);
          let limitResetDate = creationDate.addDays(limitPeriod);
          let today = new Date();

          if (limitResetDate <= today) {
            localStorage.removeItem(`limit_${id}`);
          }

          if (settings.frequency) {
            if (!localStorage.getItem(`campaign_${id}`)) {
              localStorage.setItem(`campaign_${id}`, timesShown);
              let count = localStorage.getItem(`campaign_${id}`);
              if (
                settings.frequency &&
                parseInt(count) >= parseInt(settings.frequencyTime)
              ) {
                console.log("Limit is reached");
                localStorage.setItem(`limit_${id}`, true);
              } else if (
                settings.frequency &&
                parseInt(count) < parseInt(settings.frequencyTime)
              ) {
                console.log("Limit not reached yet");
              } else {
                console.log("Frequency is off");
              }
            } else {
              let count = localStorage.getItem(`campaign_${id}`);

              if (!localStorage.getItem(`limit_${id}`)) {
                count++;
                localStorage.setItem(`campaign_${id}`, count);
              } else {
                return;
              }

              if (
                settings.frequency &&
                parseInt(count) >= parseInt(settings.frequencyTime)
              ) {
                console.log("Limit is reached");
                localStorage.setItem(`limit_${id}`, true);
              } else if (
                settings.frequency &&
                parseInt(count) < parseInt(settings.frequencyTime)
              ) {
                console.log("Limit not reached yet");
              } else {
                console.log("Frequency is off");
              }
            }
          } else {
            return;
          }
        };

        let triggered = false;
        function workOnClassAdd() {
          handleFrequency(_id);
          handleAutoClose();

          if (!triggered) {
            triggered = true;
          }
        }

        function workOnClassRemoval() {}

        // watch for a specific class change
        let classWatcher = new ClassWatcher(
          modal,
          "open",
          workOnClassAdd,
          workOnClassRemoval
        );

        const createModal = (condition) => {
          // timer for time on page
          let timerElapsed = false;
          // if (
          //   settings.triggers.some((trigger) => {
          //     trigger.triggerType === "time-on-page";
          //   })
          // ) {
          //   timerElapsed = false;
          // } else {
          //   timerElapsed = true;
          // }

          let exit = false;
          let scrolled = false;
          let finishedScrolling = false;

          const checkCondition = (trigger) => {
            if (trigger.triggerType === "url") {
              if (trigger.matchingFormat === "contains") {
                urlTrigger = window.location.href.includes(
                  trigger.matchingInput
                );
                if (urlTrigger) {
                  return trigger.triggerType === "url";
                }
              } else if (trigger.matchingFormat === "matches") {
                urlTrigger = window.location.href === trigger.matchingInput;
                if (urlTrigger) {
                  return trigger.triggerType === "url";
                }
              }
            } else if (trigger.triggerType === "cart-size") {
              if (trigger.matchingFormat === "greater") {
                if (cartData.item_count > trigger.matchingInput) {
                  return trigger.triggerType === "cart-size";
                }
              } else if (trigger.matchingFormat === "less") {
                if (cartData.item_count < trigger.matchingInput) {
                  return trigger.triggerType === "cart-size";
                }
              }
            } else if (trigger.triggerType === "cart-value") {
              if (trigger.matchingFormat === "greater") {
                if (cartData.total_price / 100 > trigger.matchingInput) {
                  return trigger.triggerType === "cart-value";
                }
              } else if (trigger.matchingFormat === "less") {
                if (cartData.total_price / 100 < trigger.matchingInput) {
                  return trigger.triggerType === "cart-value";
                }
              }
            } else if (trigger.triggerType === "product-in-cart") {
              if (trigger.matchingFormat === "contains") {
                let matchingCartItems = cartData.find((item) =>
                  item.title.includes(trigger.matchingInput)
                );
                if (matchingCartItems != undefined) {
                  return trigger.triggerType === "product-in-cart";
                }
              } else if (trigger.matchingFormat === "matches") {
                let matchingCartItems = cartData.find(
                  (item) => item.title === trigger.matchingInput
                );
                if (matchingCartItems != undefined) {
                  return trigger.triggerType === "product-in-cart";
                }
              }
            } else if (scrolled) {
              return trigger.triggerType === "scroll-depth";
            } else if (trigger.triggerType === "time-on-page") {
              if (timerElapsed) {
                return trigger.triggerType === "time-on-page";
              }
            } else if (trigger.triggerType === "exit-intent") {
              if (exit) {
                return trigger.triggerType === "exit-intent";
              }
            }
          };

          const trapFocus = (element) => {
            const modal = element;
            const focusableElements =
              'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
            const firstFocusableElement = modal.querySelectorAll(
              focusableElements
            )[0];
            const focusableContent = modal.querySelectorAll(focusableElements);
            const lastFocusableElement =
              focusableContent[focusableContent.length - 1];

            document.addEventListener("keydown", function (e) {
              let isTabPressed = e.key === "Tab" || e.keyCode === 9;

              if (!isTabPressed) {
                return;
              }

              // if shift key pressed for shift + tab combination
              if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                  lastFocusableElement.focus();
                  e.preventDefault();
                }
              }

              // if tab key is pressed
              else {
                if (document.activeElement === lastFocusableElement) {
                  firstFocusableElement.focus();
                  e.preventDefault();
                }
              }
            });
          };

          const check = () => {
            console.log("checked");

            let conditionsMatched;
            if (condition === "all") {
              conditionsMatched = triggers.every(checkCondition);
            } else if (condition === "any") {
              conditionsMatched = triggers.some(checkCondition);
            }

            let timerObj = triggers.find(
              (trigger) => trigger.triggerType === "time-on-page"
            );
            if (!timerElapsed) {
              setTimeout(
                () => {
                  timerElapsed = true;
                  check();
                },
                timerObj ? timerObj.matchingInput * 1000 : null
              );
            }

            if (
              conditionsMatched &&
              !finishedScrolling &&
              !triggered &&
              !localStorage.getItem(`limit_${_id}`)
            ) {
              console.log("conditions matched");
              // CONTENT TYPES
              setContentTypes();
              modal.classList.add("ezy-style-modal--animate");
              setTimeout(function () {
                modal.classList.remove("ezy-style-modal--animate");
              }, 100);

              let closeBtn = document.querySelector(".closeBtn");
              closeBtn.addEventListener("click", (e) => {
                modal.classList.add("ezy-style-modal--animate");
                setTimeout(function () {
                  modal.classList.add("tw-hidden");
                }, 1000);
                isOpen = false;
              });
              closeBtn.addEventListener("keyup", (e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  modal.classList.add("ezy-style-modal--animate");
                  setTimeout(function () {
                    modal.classList.add("tw-hidden");
                  }, 1000);
                  isOpen = false;
                }
              });
              modal.addEventListener("click", function (e) {
                if (e.target == this) {
                  modal.classList.add("ezy-style-modal--animate");
                  setTimeout(function () {
                    modal.classList.add("tw-hidden");
                  }, 1000);
                }
              });

              trapFocus(modal);

              if (
                triggers.some((trigger) => {
                  // exit intent
                  return trigger.triggerType === "scroll-depth";
                })
              ) {
                finishedScrolling = true;
              }
              document.removeEventListener("mouseout", mouseEvent);
            }
          };
          check();

          // EXIT INTENT CHECK
          const mouseEvent = (e) => {
            const shouldShowExitIntent =
              !e.toElement && !e.relatedTarget && e.clientY < 10;

            if (shouldShowExitIntent) {
              // document.removeEventListener("mouseout", mouseEvent); not removing cuz we wanna check every time
              // Handling delay here
              // flip the exit switch
              exit = true;
              check();
            }
          };
          if (
            triggers.some((trigger) => {
              // exit intent
              return trigger.triggerType === "exit-intent";
            })
          ) {
            document.addEventListener("mouseout", mouseEvent);
          }

          // Cart catch
          (function (ns, fetch) {
            if (typeof fetch !== "function") return;

            ns.fetch = function () {
              const response = fetch.apply(this, arguments);

              response.then((res) => {
                if (
                  [
                    `${window.location.origin}/cart/add.js`,
                    `${window.location.origin}/cart/update.js`,
                    `${window.location.origin}/cart/change.js`,
                    `${window.location.origin}/cart/clear.js`,
                  ].includes(res.url)
                ) {
                  res
                    .clone()
                    .json()
                    .then((data) => {
                      cartDataFetch = fetchCartInfo();
                      cartDataFetch.then((cart) => {
                        cartData = cart;
                        check();
                      });
                    });
                }
              });

              return response;
            };
          })(window, window.fetch);

          // SCROLL DEPTH CHECK
          const catchModal = () => {
            scrollpos = window.scrollY;
            let scrollObj = triggers.find(
              (trigger) => trigger.triggerType === "scroll-depth"
            );
            if (!scrolled) {
              if (scrollpos >= scrollObj.matchingInput) {
                console.log("found");
                scrolled = true;
                check();
              }

              console.log("catching");
            } else {
              console.log("remove listener");
              document.removeEventListener("scroll", catchModal);
            }
          };

          if (
            triggers.some((trigger) => {
              // exit intent
              return trigger.triggerType === "scroll-depth";
            })
          ) {
            document.addEventListener("scroll", catchModal);
          }
        };

        // MATCH CONDITIONS -------------------------------------------------------------------
        if (triggerMatch === "all") {
          console.log("all triggers are matched");
          createModal("all");
        } else if (triggerMatch === "any") {
          console.log("any triggers are matched");
          createModal("any");
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};
campaignInfo();
