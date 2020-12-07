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
    const cartData = await fetchCartInfo();
    console.log(cartData);
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
        const toggleBtn = document.querySelector(".toggle");
        const body = document.body;
        const modal = document.createElement("div");
        const popup_content = document.createElement("div");

        let img;
        if (content.imgUrl !== "") {
          img = document.createElement("img");
          img.classList.add("image");
          img.src = content.imgUrl;
        }

        let heading;
        if (content.headline !== "") {
          heading = document.createElement("h2");
          heading.textContent = content.headline;
          heading.classList.add("heading");
        }

        let bodyText;
        if (content.body !== "") {
          bodyText = document.createElement("p");
          bodyText.textContent = content.body;
          bodyText.classList.add("bodyText");
        }

        const closeBtn = document.createElement("i");
        closeBtn.classList.add("far", "fa-times-circle", "closeBtn");
        closeBtn.tabIndex = 1;

        let buttons;
        if (content.buttonText !== "") {
          buttons = document.createElement("div");
          buttons.classList.add("buttons");
        }

        let textContainer;
        if (!heading && !bodyText && !buttons) {
          textContainer = undefined;
        } else {
          textContainer = document.createElement("div");
          textContainer.classList.add("text-container");
        }

        const container = document.createElement("div");

        const primaryBtn = document.createElement("button");
        const primaryBtnNewsletter = document.createElement("button");
        // const secondaryBtn = document.createElement("button");
        const btnLink = document.createElement("a");
        const freeIcon = document.createElement("i");
        // Input for newsletter
        const input = document.createElement("input");
        // Product feed elements (everything else is created in the forEach below)
        const productContainer = document.createElement("div");

        // Loading fontAwesome
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
        document.head.appendChild(link);

        const borderRadius = style.borderRadius + "%";
        const borderWidth = style.borderWidth + "px";

        // CREATING CSS STYLESHEET

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
					  }
  
					  .container {
						  display: grid;
						  grid-template-columns: 1fr 1fr;
						  grid-template-rows: 1fr;
						  height: 100%;
					  }
  
					  .container-product-feed {
						  width: 90%;
						  margin: 1rem auto;
					  }
  
					  .container-newsletter {
						  width: 90%;
						  margin: 1rem auto;
					  }
  
					  .container-one-half{
						  display: grid;
						  grid-template-columns: 1fr;
						  grid-template-rows: 1fr;
						  height: 100%;
					  }
  
					  .image {
						  height: 100%;
						   width: 100%;
						  min-width: 200px;
						   box-shadow: 1px 3px 5px #0000002b; 
						   object-fit: cover; 
						   margin-right: 1rem
					  }
  
					  .text-container {
						  min-width: 200px;
						  height: 100%;
						  display: flex;
						  flex-direction: column;
						  justify-content: center;
						  align-items: center;
						  margin: 0 3rem 0 2rem;
					  }
  
					  .input-container {
						  display: grid;
						  grid-template-columns: 60% 40%;
					  }
  
					  .input-container input {
						  padding-left: 0.6rem;  
						  width: 400px; 
						  border: 1px solid #CDD9ED; 
						  line-height: 25px; 
						  font-size: 14px; 
						  font-weight: 500; 
						  font-family: inherit; 
						  border-radius: 6px 0 0 6px;
					  }
  
					  .heading {
						  margin: 1rem 0;
					  }
  
					  .bodyText {
						  margin-bottom: 0.7rem;
					  }
  
					  .buttons {
						  width: 100%; 
						  margin-bottom: 0.7rem; 
						  display: flex;
					  }
					  .btnLink {
						  justify-self:end;
					  }
					  
					  .primaryBtn {
						  width: 100%;
						  padding: 0.7rem; 
						  background: ${primaryButtonColor}; 
						  box-shadow: #0000002e 1px 1px 3px;
						  border:none;  
						  border-radius: 0.25rem;  
						  color: white; 
						  font-family:inherit; 
						  font-size: 0.93rem; 
						  margin-top: 1.5rem;
						  margin-right: 0.6rem;
						  margin-bottom: 1rem;
						  transition: opacity 0.3s ease;
						  
					  }
  
					  .primaryBtn-newsletter {
						  
						  padding: 0.7rem; 
						  background: ${primaryButtonColor}; 
						  box-shadow: #0000002e 1px 1px 3px;
						  border:none;  
						  border-radius: 3%;  
						  color: white; 
						  font-family:inherit; 
						  font-size: 0.75rem; 
						  margin-right: 0.6rem;
						  transition: opacity 0.3s ease;
					  }
  
					  .primaryBtn:hover {
						  opacity:0.8;
						  cursor:pointer;
					  }
					  .primaryBtn-newsletter:hover {
						  opacity:0.8;
						  cursor:pointer;
					  }
  
					  .closeBtn {
						  position: absolute;
						  right: 0;
						  top: 0;
						  margin-top: -2.1rem;
						  font-size: 1.6rem;
						  transition: 0.25s opacity ease;
					  }
  
					  .closeBtn:hover {
						  opacity: 0.85;
						  cursor:pointer;
					  }
  
					  .productContainer {
						  display: flex;
						  width: 90%;
						  margin:auto;
						  overflow-x: auto;
					  }
  
					  .product {
						  margin-right: 1rem;
					  }
  
					  .prodImg {
						  width: 200px;
						  height:  200px;
						  object-fit: cover;
						  box-shadow: 1px 1px 3px #00000033;
						  border-radius: 5%;
					  }
  
					  .free-icon {
						  position: absolute;
						  left: 2%;
						  bottom: 5%;
						  color:#494949 ;
						  margin-top: 0.7rem;
						  font-size: 1em;
					  }
  
					  .free-icon::after {
						  opacity: 0;
							  content: "Popup powered by Easypop";
						  font-weight: 300;
						  padding: 8px;
						  transition: 0.25s opacity ease;
						  background: #efefef;
						  border-radius: 30px;
					  }
  
					  .free-icon:hover:after {
						  opacity: 1;
						  background: #efefef;
					  }
  
					  @media only screen and (max-width: 768px) {
						  .container {
							  grid-template-columns: 1fr;
							  grid-template-rows: 1fr 1fr;
							  height: 100%;
						  }
  
						  .text-container {
							  margin: 0 3rem 1rem 2rem;
						  }
  
						  .free-icon {
							  left: 3%;
							  top: 1%;
						  }
  
  
						  .input-container {
							  grid-template-rows: 1fr 1fr;
							  grid-template-columns: 1fr;
						  }
  
						  .input-container input {
							  width: auto;
							  margin-bottom: 1rem;
						  }
  
						  .btnLink {
							  justify-self: start;
						  }
						}
					  `;
        document.getElementsByTagName("head")[0].appendChild(stylesheet);

        // Modal content
        popup_content.style.cssText = ` min-height: 300px; max-width: 60%; position: relative; background: ${backgroundColor}; border-radius: ${borderRadius}; border: ${borderWidth} solid ${borderColor}; box-shadow:#00000038 5px 5px 10px 0px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; transition: 1s all ease;`;

        // SET CONTENT TYPES
        const setContentTypes = () => {
          if (content.contentType === "text-image") {
            // CONTENT

            primaryBtn.textContent = content.buttonText;
            btnLink.href = content.buttonUrl;
            // secondaryBtn.textContent = "Cancel";
            if (!textContainer || !img) {
              container.classList.add("container-one-half");
            } else {
              container.classList.add("container");
            }

            modal.appendChild(popup_content);
            modal.appendChild(closeBtn);
            popup_content.appendChild(container);
            if (img) {
              container.appendChild(img);
            }

            if (textContainer) {
              container.appendChild(textContainer);
            }
            if (heading) {
              textContainer.appendChild(heading);
            }
            if (bodyText) {
              textContainer.appendChild(bodyText);
            }

            container.appendChild(closeBtn);

            if (buttons) {
              textContainer.appendChild(buttons);
              buttons.appendChild(btnLink);
              btnLink.appendChild(primaryBtn);
            }

            body.appendChild(modal);
          } else if (content.contentType === "newsletter") {
            const inputContainer = document.createElement("div");
            inputContainer.classList.add("input-container");
            container.classList.add("container-newsletter");
            primaryBtnNewsletter.textContent = content.buttonText;
            btnLink.href = content.buttonUrl;
            input.type = "text";

            modal.appendChild(popup_content);
            popup_content.appendChild(container);
            container.appendChild(heading);
            if (bodyText) {
              container.appendChild(bodyText);
            }
            container.appendChild(closeBtn);
            container.appendChild(inputContainer);
            inputContainer.appendChild(input);
            inputContainer.appendChild(btnLink);
            btnLink.appendChild(primaryBtnNewsletter);

            body.appendChild(modal);

            primaryBtnNewsletter.classList.add("primaryBtn-newsletter");
          } else if (content.contentType === "product-feed") {
            productContainer.classList.add("productContainer");
            container.classList.add("container-product-feed");
            modal.appendChild(popup_content);
            popup_content.appendChild(container);
            if (heading) {
              container.appendChild(heading);
            }

            if (bodyText) {
              container.appendChild(bodyText);
            }
            container.appendChild(closeBtn);
            popup_content.appendChild(productContainer);
            // Run a forEach loop for how many products we want here?
            const products = content.selectedProducts[0].selection;
            console.log(products);
            products.forEach((prod) => {
              const product = document.createElement("div");
              const prodImg = document.createElement("img");
              const prodTitle = document.createElement("h3");
              const prodPrice = document.createElement("p");
              const primaryBtn = document.createElement("p");

              product.classList.add("product");
              prodImg.classList.add("prodImg");
              prodTitle.classList.add("prodTitle");
              prodPrice.classList.add("prodPrice");
              primaryBtn.classList.add("primaryBtn");
              primaryBtnNewsletter.classList.add("primaryBtn-newsletter");

              productContainer.appendChild(product);
              product.appendChild(prodImg);
              product.appendChild(prodTitle);
              product.appendChild(prodPrice);
              product.appendChild(primaryBtn);

              const image =
                prod.images.length === 0
                  ? "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
                  : prod.images[0].originalSrc;

              prodTitle.textContent = prod.title;
              prodPrice.textContent = prod.variants[0].price;
              prodImg.src = image;
              primaryBtn.textContent = "Add to Cart";
            });

            body.appendChild(modal);
          } else if (content.contentType === "custom-html") {
            const customHtml = content.customHtml;

            popup_content.innerHTML = customHtml;

            modal.appendChild(popup_content);
            body.appendChild(modal);
            popup_content.appendChild(closeBtn);
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

          // add all the elements inside modal which you want to make focusable
          const focusableElements = "input, button, i";
          const modal = document.querySelector(".modal-ep"); // select the modal by its class

          const firstFocusableElement = modal.querySelectorAll(
            focusableElements
          )[0]; // get first element to be focused inside modal
          const focusableContent = modal.querySelectorAll(focusableElements);
          const lastFocusableElement =
            focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

          document.addEventListener("keydown", function (e) {
            let isTabPressed = e.key === "Tab" || e.keyCode === 9;

            if (!isTabPressed) {
              return;
            }

            if (e.shiftKey) {
              // if shift key pressed for shift + tab combination
              if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus(); // add focus for the last focusable element
                e.preventDefault();
              }
            } else {
              // if tab key is pressed
              if (document.activeElement === lastFocusableElement) {
                // if focused has reached to last focusable element then focus first focusable element after pressing tab
                firstFocusableElement.focus(); // add focus for the first focusable element
                e.preventDefault();
              }
            }
          });

          firstFocusableElement.focus();
        }

        function workOnClassRemoval() {
          // const focusableElements = "input, button, i";
          const modal = document.querySelector(".modal-ep");
          modal.tabIndex = -1;
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
              // classes
              primaryBtn.classList.add("primaryBtn");

              btnLink.classList.add("btnLink");

              if (freePlan) {
                freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
                popup_content.appendChild(freeIcon);
              }

              closeBtn.addEventListener("click", (e) => {
                modal.classList.remove("open");
                isOpen = false;
              });
              closeBtn.addEventListener("keyup", (e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  modal.classList.remove("open");
                  isOpen = false;
                }
              });

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
              // classes
              primaryBtn.classList.add("primaryBtn");

              if (freePlan) {
                freeIcon.classList.add("fas", "fa-info-circle", "free-icon");
                popup_content.appendChild(freeIcon);
              }

              closeBtn.addEventListener("click", (e) => {
                modal.classList.remove("open");
                isOpen = false;
              });

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
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};
campaignInfo();
