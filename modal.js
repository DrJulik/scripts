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
          "https://cdn.jsdelivr.net/gh/DrJulik/scripts@1.0.931/styles.min.css";
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
            body.appendChild(modal);
          } else if (content.contentType === "product-feed") {
            const products = content.selectedProducts[0].selection;
            modal.innerHTML = `
            <section class="ezy-style-modal">
  <section class="ezy-style-modal__window">
    <section class="ezy-style-modal__close">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </section>
    <section class="ezy-style-modal__content">
      <div class="flex flex-row flex-wrap">
        <div class="w-full sm:w-full flex justify-center items-center p-4 md:p-8">
          <div class="overflow-hidden">
            <div class="">
              <h3 class="ezy-test__headline--bold-1 mb-2">Campaign headline for a standard modal</h3>
              <p class="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div class="ezy-product-feed">
            ${products.map((product) => {
              return `<div class="ezy-product-feed__item">
              <img class="image--square" src="https://images.unsplash.com/photo-1602607203559-d38903b80507?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3898&q=80"/>
              <p>Product title</p>
              <p class="pb-2">$8.00</p>
              <a class="ezy-btn w-full" href="">Add to cart</a>
            </div>`;
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</section>`;

            body.appendChild(modal);
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

              let closeBtn = document.querySelector(".closeBtn");
              closeBtn.addEventListener("click", (e) => {
                modal.classList.add("ezy-style-modal--closed");
                setTimeout(function () {
                  modal.classList.add("tw-hidden");
                }, 1000);
                isOpen = false;
              });
              closeBtn.addEventListener("keyup", (e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  modal.classList.add("ezy-style-modal--closed");
                  setTimeout(function () {
                    modal.classList.add("tw-hidden");
                  }, 1000);
                  isOpen = false;
                }
              });
              modal.addEventListener("click", function (e) {
                if (e.target == this) {
                  modal.classList.add("ezy-style-modal--closed");
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
