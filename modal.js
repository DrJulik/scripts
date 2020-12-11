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
    let cart_size = cartData.item_count;
    let cart_value = cartData.total_price;
    campData.forEach((campaign) => {
      console.log(campaign);
      const { freePlan, style, content, settings, _id, createdAt } = campaign;
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
        const modal = document.createElement("div");

        // Loading fontAwesome
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
        document.head.appendChild(link);

        let link1 = document.createElement("link");
        link1.rel = "stylesheet";
        link1.href = "https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css";
        document.head.appendChild(link1);

        const borderRadius = style.borderRadius + "%";
        const borderWidth = style.borderWidth + "px";

        let stylesheet = document.createElement("style");
        stylesheet.type = "text/css";
        stylesheet.innerHTML = `.modal-ep { z-index: 10000;
                        pointer-events: none;
                        opacity: 0;
                        display: flex;
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100%;
                        width: 100%;
                        background-color: ${overlayColor};
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        transition: 0.4s opacity ease; }
    
                        .modal-ep.open {
                            pointer-events: all;
                        opacity: 1;
                        }`;
        document.getElementsByTagName("head")[0].appendChild(stylesheet);

        // SET CONTENT TYPES
        const setContentTypes = () => {
          if (content.contentType === "text-image") {
            modal.innerHTML = `
            <section class="ezy-style-modal">
            <section class="ezy-style-modal__window">
              <section class="ezy-style-modal__close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </section>
              <section class="ezy-style-modal__content">
                <div class="flex flex-row flex-wrap justify-center">
                  <div class="w-full sm:w-1/2 relative">
                    <img class="image--portrait" src="https://images.unsplash.com/photo-1602607203559-d38903b80507?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3898&q=80"/>
          
                    <span class="ezy-tooltip ezy-test__body--smaller absolute bottom-1 left-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      Powered by Easypop
                    </span>
          
                  </div>
                  <div class="w-full sm:w-1/2 flex justify-center items-center p-4 md:p-8">
                    <div>
                    ${
                      content.headline !== ""
                        ? `<h3 class="ezy-test__headline--bold-1 mb-2">${content.headline}</h3>`
                        : ""
                    }
                      
                      <p class="mb-4">
                      ${content.body !== "" ? `${content.body}` : ""}
                      </p>
                      ${
                        content.buttonText !== ""
                          ? `<a class="ezy-btn w-full" href="${content.buttonUrl}">${content.buttonText}</a>`
                          : ""
                      }
                      
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </section>
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
          // // add all the elements inside modal which you want to make focusable
          // const focusableElements = "input, button, i";
          // const modalEP = document.querySelector(".modal-ep"); // select the modal by its class

          // const firstFocusableElement = modalEP.querySelectorAll(
          //   focusableElements
          // )[0]; // get first element to be focused inside modal
          // const focusableContent = modalEP.querySelectorAll(focusableElements);
          // const lastFocusableElement =
          //   focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

          // document.addEventListener("keydown", function (e) {
          //   let isTabPressed = e.key === "Tab" || e.keyCode === 9;

          //   if (!isTabPressed) {
          //     return;
          //   }

          //   if (e.shiftKey) {
          //     // if shift key pressed for shift + tab combination
          //     if (document.activeElement === firstFocusableElement) {
          //       lastFocusableElement.focus(); // add focus for the last focusable element
          //       e.preventDefault();
          //     }
          //   } else {
          //     // if tab key is pressed
          //     if (document.activeElement === lastFocusableElement) {
          //       // if focused has reached to last focusable element then focus first focusable element after pressing tab
          //       firstFocusableElement.focus(); // add focus for the first focusable element
          //       e.preventDefault();
          //     }
          //   }
          // });

          // firstFocusableElement.focus();
        }

        function workOnClassRemoval() {
          primaryBtn.tabIndex = -1;
          btnLink.tabIndex = -1;

          document.querySelector("body").focus();
        }

        // watch for a specific class change
        let classWatcher = new ClassWatcher(
          modal,
          "open",
          workOnClassAdd,
          workOnClassRemoval
        );

        // MATCH CONDITIONS -------------------------------------------------------------------
        if (triggerMatch === "all") {
          console.log("all triggers are matched");

          // timer for time on page
          let timerElapsed;
          if (
            settings.triggers.some((trigger) => {
              trigger.triggerType === "time-on-page";
            })
          ) {
            timerElapsed = false;
          } else {
            timerElapsed = true;
          }

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

          const check = () => {
            console.log("checked");
            const conditionsMatched = triggers.every(checkCondition);

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

            if (conditionsMatched && !finishedScrolling) {
              console.log("conditions matched");
              modal.classList.add("modal-ep");
              if (settings.delay) {
                setTimeout(() => {
                  modal.classList.add("open");
                }, settings.delayTime * 1000);
              } else {
                setTimeout(() => {
                  modal.classList.add("open");
                }, 200);
              }
              // CONTENT TYPES
              setContentTypes();

              // closeBtn.addEventListener("click", (e) => {
              //   modal.classList.remove("open");
              //   isOpen = false;
              // });
              // closeBtn.addEventListener("keyup", (e) => {
              //   if (e.keyCode === 13) {
              //     e.preventDefault();
              //     modal.classList.remove("open");
              //     isOpen = false;
              //   }
              // });

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

          // TIME ON PAGE
          if (
            triggers.some((trigger) => {
              // exit intent
              return trigger.triggerType === "time-on-page";
            })
          ) {
            check();
          }
        } else if (triggerMatch === "any") {
          console.log("any triggers are matched");
          // TRIGGERS START-----------------------------------------------------------------------------------------------------------------------------------------------

          // timer for time on page
          let timerElapsed = false;
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

          const check = () => {
            const conditionsMatched = triggers.some(checkCondition);

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
              // FIGURE OUT HOW TO GET THE TIME OF THE FIRST TIME ON PAGE TRIGGER
            }

            if (conditionsMatched && !finishedScrolling) {
              console.log("conditions matched");

              modal.classList.add("modal-ep");
              if (settings.delay) {
                setTimeout(() => {
                  modal.classList.add("open");
                }, settings.delayTime * 1000);
              } else {
                setTimeout(() => {
                  modal.classList.add("open");
                }, 200);
              }
              // CONTENT TYPES
              setContentTypes();

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
                      console.log(data);
                      cartData = data;
                      check();
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

          // TIME ON PAGE
          if (
            triggers.some((trigger) => {
              // exit intent
              return trigger.triggerType === "time-on-page";
            })
          ) {
            check();
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};
campaignInfo();
