/*Dominity.js
==================================================>
-DominityELement (create,el,_el,$el,$$el)
-Reactive   (reactable)
-DominityRouter
----------

*/

/**
 * A wrapper for normal DOM elements with additional methods to make it reactive
 * @class
 */
class DominityElement {
  /**
   * Creates a new instance of  DOminityElement
   * @constructor
   * @param {string|HTMLElement} qry -query or HTMLELement to be converted to DominityInstance
   */
  constructor(qry) {
    if (typeof qry === 'string') {
      this.elem = document.querySelector(qry);
    } else {
      this.elem = qry;
    }
    if (this.elem == null) {
      console.error(`DominityError: element of query '${qry}'  NOT  FOUND `);
      return;
    }
    this.dominityElem = true;
    this.tag = this.elem.tagName;
    this.template = false; //For later use to store content
  }

  /**
   * Gets or sets the text content of element
   * @param {string} [val] -value can be left blank to get the current text inside the element
   * @returns {string|this}
   */
  text(val = null) {
    if (val == null) {
      return this.elem.textContent;
    } 
      if (!this.template) {
        this.template = val; //Stores previous content
      }
      this.elem.textContent = val;
      return this;
    
  }

  /**
   * To make text of an element reactive to reactables
   * @param  {...reactive} s- reactables u want the content of this element to stay reactive to
   * @returns {this}
   */
  reactTo(...s) {
    let template = this.html();

    s.forEach((r) => {
      r.subscribe((t) => {
        if (typeof t.value !== 'object') {
          this.text(
            template.replace(new RegExp(`{{${  r.name  }}}`, 'gi'), t.value),
          );
        } else {
          Object.keys(t.value).forEach((k) => {
            this.html(
              template.replace(
                new RegExp(`{{${  r.name  }.${  k  }}}`, 'gi'),
                t.value[k],
              ),
            );
            template = this.html();
          });
        }
      });
      r.update();
    });

    return this;
  }

  /**
   * Used to set or get the innerHTML of an element
   * @param {string} [val]- the innerHTML to be set
   * @returns {string|this}
   */
  html(val = null) {
    if (val == null) {
      return this.elem.innerHTML;
    } 
      this.elem.innerHTML = val;
      return this;
    
  }

  //Css styling
  /**
   * Allows u to get or set CSS properties
   * @param {string|object} prp -property value to be get or set
   * @param {string} [val] - value to set the prop
   *
   * you can provide an object with multiple prop value pairs to bulk set style
   * @returns {string|this}
   */
  style(prp, val = null) {
    if (typeof prp === 'string') {
      if (val == null) {
        return window.getComputedStyle(this.elem, null).getPropertyValue(prp);
      } 
        this.elem.style[prp] = val;
        return this;
      
    } else if (typeof prp === 'object') {
      Object.assign(this.elem.style, prp);
      return this;
    }
  }

  //Class manipulation
  /**Used to set classes to an element
   * @param {...string} className- classes to be set on the element
   * @returns {this}
   */
  class() {
    Array.from(arguments).forEach((c) => {
      this.elem.classList.add(c);
    });
    return this;
  }
  /**
   * Used to remove classes from an element
   * @param {...string} className- classes to be removed
   * @returns {this}
   */
  removeClass() {
    Array.from(arguments).forEach((c) => {
      this.elem.classList.remove(c);
    });
    return this;
  }
  /**
   * Used to toggle classes from an element
   * @param {...string} className- classes to be toggled
   * @returns {this}
   */
  toggleClass() {
    Array.from(arguments).forEach((c) => {
      this.elem.classList.toggle(c);
    });
    return this;
  }
  /**
   * Used to conditionally toggle a class
   *
   */
  bindClass(react, classname, swap = '', byprocess = (v) => v) {
    if (react instanceof DominityReactive) {
      react.subscribe((v) => {
        this.bindClass(byprocess(v.value), classname);
      });
    } else if (react) {
        this.class(classname);
        if (swap != '') {
          if (this.hasClass(swap)) {this.removeClass(swap);}
        }
      } else {
        this.removeClass(classname);
        if (swap != '') {this.class(swap);}
      }
    return this;
  }

  /**
   * Used to check if an element has certain class
   * @param {...string} className- classes to be checked
   * @returns {boolean}
   */
  hasClass(cls) {
    return this.elem.classList.contains(cls);
  }

  //Attribute manipulation
  /**
   * Allows u to get or set attributes of an element
   * @param {string|object} prp -attribute value to be get or set
   * @param {string} [val] - value to set the attribute to
   * you can provide an object with multiple attribute value pairs to bulk set attributes
   * @returns {string|this}
   */
  attr(prp, val = null) {
    if (typeof prp === 'string') {
      if (val == null) {
        return this.elem.getAttribute(prp);
      } 
        this.elem.setAttribute(prp, val);
        return this;
      
    } else if (typeof prp === 'object') {
      const attrs = Object.keys(prp),
       vals = Object.values(prp);
      attrs.forEach((p, i) => {
        this.attr(p, vals[i]);
      });
      return this;
    }
  }
  /**
   * Used to check if an element has certain attribute
   * @param {...string} attributeName- attribute to be checked
   * @returns {boolean}
   */
  hasAttr(val = null) {
    if (val != null) {
      return this.elem.hasAttribute(val);
    } else if (val == null) {
      return this.elem.hasAttributes();
    }
  }
  /**
   * Used to remove attbutes from an element
   * @param {...string} attributes-attributes to be removed
   * @returns {this}
   */
  removeAttr() {
    Array.from(arguments).forEach((at) => {
      this.elem.removeAttribute(at);
    });
  }
  /**
   * Used to toggle attribute of an element
   * @param {string} atr- attribute to be toggled
   * @param {string} [val]- value of attribute to be toggled
   * @returns {this}
   */
  toggleAttr(atr, val = '') {
    if (this.hasAttr(atr)) {
      this.removeAttr(atr);
    } else {
      this.attr(atr, val);
    }
    return this;
  }

  //Value and input methods-------------------
  /**
   * Used to set or get value of an input element
   * @param {any} val
   * @returns {any}
   */
  value(val = null) {
    if (val == null) {
      return this.elem.value;
    } 
      this.elem.value = val;
    
  }

  //Events manipulation---------------------------
  /**
   * Checks for an event and adds an event listener
   * @param {string} e- eventname to be checked
   * @param {function} cb -callback function
   * @param {boolean} bub -event bubling
   * @returns {this}
   */
  checkFor(e, cb, bub) {
    this.elem.addEventListener(e, cb, bub);
    return this;
  }
  /**
   * Stops listening for an event
   * @param {Event} ev -event
   * @param {function} func -function
   * @param {boolean} bub -bubling
   * @returns {this}
   */
  stopCheckFor(ev, func, bub) {
    this.elem.removeEventListener(ev, func, bub);
    return this;
  }
  /**
   * Triggers a new event
   * @param {any} ev -event to be dispatched
   * @returns {this}
   */
  causeEvent(ev) {
    this.elem.dispatchEvent(ev);

    return this;
  }
  /**
   * Triggers a custom event directly
   * @param {string} name -name of the event
   * @param {object} data -to be sent with the event
   */
  causeCustomEvent(name, data = {}) {
    this.causeEvent(
      new CustomEvent(name, {
        detail: data,
      }),
    );
    return this;
  }

  /**
   * Checks for click events
   * @param {function} cb -call back function
   * @returns {this}
   */
  onClick(cb) {
    this.checkFor('click', (e) => {
      cb(this, e);
    });
    return this;
  }

  /**
   * Enables the ability to listen for 'hold' events on the element
   * @param {number} [holdtime] -time delay for click and hold to be triggered
   * @returns {this}
   */
  enableHold(holdtime = 0.5) {
    this.isHolding = false;
    const element = this;
    function handleDOWN(e) {
      this.isHolding = true;
      this.timeout = setTimeout((e) => {
        if (this.isHolding) {
          element.causeEvent(new CustomEvent('hold', { details: e }));
        }
      }, holdtime * 1000);
    }
    function handleUP(e) {
      this.isHolding = false;
      clearTimeout(this.timeout);
    }
    this.checkFor('mousedown', handleDOWN);
    this.checkFor('touchstart', handleDOWN);
    this.checkFor('mouseup', handleUP);
    this.checkFor('touchend', handleUP);
    return this;
  }
  //Dom manipulation{this}
  /**
   * Appends the element to another element provided
   * @param {DominityElement|HTMLELement} elm -parent element to add to
   * @returns {this}
   */
  addTo(elm) {
    if (elm.dominityElem) {
      elm.addChild(this);
    } else {
      elm.appendChild(this.elem);
    }

    return this;
  }
  /**
   * Inserts this element to another element at a certin position
   * @param {DominityElement|HTMLELement} elm-parent element to add to
   * @param {string} placement -positon from beforebegin,afterbegin,beforeend,afterend etc
   * @see `insertHtml()`
   * @returns {this}
   */
  insertTo(elm, placement) {
    if (elm != null) {
      if (elm.dominityElem) {
        elm.insertChild(placement, this.elem);
      } else {
        elm.insertAdjacentElement(placement, this.elem);
      }
    }
  }
  /**
   * Removes the element from the DOM tree
   * @returns {this}
   */
  remove() {
    this.elem.remove();
    return this;
  }
  /**
   * Creates a child element and addes it
   * @param {string} typ -valid html tagname of element
   * @param {string|object} txt-text inside the child element (if element doesnt have any text u can give an object of attribute here)
   * @param {object} attrs -objects with attribute value pairs
   * @returns {DominityElement}
   * @see -`el()`
   * returned element is the created child so now u are working with this child to go back to working with parent chain `.$end()`
   */
  _el(typ, txt = '', attrs = {}) {
    const created = !typ.dominityElem ? this.create(typ) : typ;
    if (!typ.dominityElem) {this.addChild(created);}

    if (typeof txt === 'object') {
      created.attr(txt);
    } else {
      created.text(txt).attr(attrs);
    }

    return created;
  }

  /**
   * Creates a child element
   * @param {*} el
   * @returns {DominityElement} -returned is an instance of child object to go back to working with parent chain `.$end()`
   */
  create(elem) {
    this.addedChild = el(elem);
    this.addChild(this.addedChild);
    return this.addedChild;
  }
  /**
   * Adds children to the element , multiple child elements can be added seperated by comma
   * @param {...DominityElement}
   * @returns {this}
   */
  addChild() {
    Array.from(arguments).forEach((child) => {
      if (child.dominityElem) {
        this.elem.appendChild(child.elem);
      } else {
        this.elem.appendChild(child);
      }
    });

    return this;
  }
  /**
   * Inserts children to the element
   * @param {string} placement -specifies position to be placed
   * @param {HTMLElement} nod -element to be placed
   * @returns {this}
   */
  insertChild(placement, nod) {
    this.elem.insertAdjacentElement(placement, nod);
    return this;
  }
  /**
   * Removes children to the element , multiple child elements can be removed seperated by comma
   * @returns {this}
   */
  removeChild() {
    Array.from(arguments).forEach((nod) => {
      this.elem.removeChild(this.elem.childNodes[nod]);
    });
    return this;
  }
  /**
   *
   * @param {HTMLELement} child - child to be replaced
   * @param {HTMLElement} nod - new child
   * @returns {this}
   */
  replaceChild(child, nod) {
    this.elem.replaceChild(nod, child);

    return this;
  }
  /**
   * Finds a child by query
   * @param {string} q- query to find child
   * @returns {DominityElement} -returns the child if found
   */
  $_el(q) {
    return new DominityElement(this.elem.querySelector(q));
  }
  /**
   * Gets all the children that matches the query
   * @param {string} q -query to find child
   * @returns {array} -returns array of dominityelements
   */
  $$_el(q) {
    return Array.from(this.elem.querySelectorAll(q)).map(
      (x) => new DominityElement(x),
    );
  }
  /**
   * Gets child of element by index
   * @param {index} pos
   * @returns {DominityElement} -returns the child
   */
  child(pos) {
    return new DominityElement(this.elem.children[pos]);
  }
  /**
   * @see `$end()`
   * @returns {DominityElement} - returns the parent element
   */
  parent() {
    return new DominityElement(this.elem.parentNode);
  }
  //Indevelopment
  root(element = 'body') {
    let pn = this;
    while (!pn.matches(`${element  } > *`)) {
      pn = pn.parent();
    }
    return pn;
  }
  /**
   * Returns the parent instance
   *
   * @returns {DominityElement} -returns parent so u can go back to working with parent element
   */
  $end() {
    return this.parent();
  }

  /**
   * Returns the next element in the tree
   * @returns {DominityElement}
   */
  next() {
    return new DominityElement(this.elem.nextElementSibling);
  }
  /**
   * Returns the previous element in the tree
   * @returns {DominityElement}
   */
  previous() {
    return new DominityElement(this.elem.previousElementSibling);
  }
  /**
   * Clones an element
   * @param {boolean} deep -if true a deep clone is created
   * @returns {DominityElement} -clone is returned
   */
  clone(deep = true) {
    return new DominityElement(this.elem.cloneNode(deep));
  }

  /**
   * Creates a component instance from contnet of template tag
   */
  asComponent() {
    return this.cloneContent(
      new DominityElement(this.elem.content.cloneNode(true)),
    );
  }

  /**
   * Checks if the element is contained as a child in this element
   * @param {HTMLELement|DominityElement} nod -child to be checked for
   * @returns {boolean} -truth or false
   */
  contains(nod) {
    if (nod.dominityElem) {
      return this.elem.contains(nod.elem);
    } 
      return this.elem.contains(nod);
    
  }
  /**
   * Checks if the element matches a specific query or an element
   * @param {string} q- query to be matched
   * @returns {boolean}
   */
  matches(q) {
    if (typeof q === 'string') {
      return this.elem.matches(q);
    } else if (typeof q === 'object') {
      if (q.dominityElem) {
        return q === this;
      } 
        return q === this.elem;
      
    }
  }

  //Appearance
  /**
   * Hides an element using CSS
   * @returns {this}
   */
  hide() {
    this.style('display', 'none');
    return this;
  }
  /**
   * Shows the element hidden using hide()
   * @param {string} [disp] -display property u want the element to be displayed
   * @returns {this}
   */
  show(disp = 'block') {
    this.style('display', disp);
    return this;
  }
  /**
   * Toggles hide and show
   * @param {function} [ondisp] -callback to be called when displayed
   * @param {function} [onhide] -callback to be called when hidden
   * @returns {this}
   */
  toggleHide(ondisp, onhide) {
    if (this.style('display') == 'none') {
      this.show();
      if (ondisp != undefined) {
        ondisp(this);
      }
    } else if (this.style('display') != 'none') {
      this.hide();
      if (onhide != undefined) {
        onhide(this);
      }
    }

    return this;
  }

  /**
   * Allows to show or hide an element depending on a reactable
   * @param {reactive|boolean} bool - expression or reactable
   * @returns {this}
   */
  showIf(bool, byprocess) {
    const elemS = this;
    if (bool instanceof DominityReactive) {
      bool.subscribe((data) => {
        let condition = data.value;
        if (byprocess) {
          condition = byprocess(data.value);
        }
        elemS.showIf(condition);
      });
      bool.update();

      return this;
    }

    if (bool) {
      this.show();
    } else {
      this.hide();
    }
    return this;
  }
  /**
   * RenderIf
   */
  renderIf(bool, byprocess, parent = $el('body')) {
    const elemS = this;
    this.storedParent = parent;

    if (bool instanceof DominityReactive) {
      bool.subscribe((data) => {
        let condition = data.value;
        if (byprocess) {
          condition = byprocess(data.value);
        }
        elemS.renderIf(condition);
      });
      bool.update();

      return this;
    }

    if (bool) {
      this.storedParent.addChild(this);
    } else {
      this.remove();
    }
    return this;
  }

  /**
   *
   * @param {reactive} list -any iterable reactable
   * @param {function} callback -function to be called on each iteration
   * @returns {this}
   */
  loops(list, callback) {
    const elemS = this;
    if (list instanceof DominityReactive) {
      list.subscribe((data) => {
        elemS.html('');
        data.value.forEach((item, count) => {
          callback(item, elemS, count);
        });
      });
      list.update();
      return this;
    }
    console.error(
      'DominityError: list item for ._elFor has to be a reactive object made with reactable(',
    );
    return this;
  }
  /**
   * For inputs/select allows to 2 way bind value to a reactable
   * @param {reactive|any} target
   * @returns {this}
   */
  model(target) {
    let attr = 'value';
    if (this.attr('type') == 'checkbox') {
      attr = 'checked';
    }

    if (target instanceof DominityReactive) {
      target.subscribe((d) => {
        if (!(d.value instanceof Array)) {
          this.elem[attr] = d.value;
        } else if (d.value.includes(this.elem.name)) {
            this.elem[attr] = true;
          } else {
            this.elem[attr] = false;
          }
      });
      target.update();
      this.checkFor('input', () => {
        let val = this.value();
        if (this.attr('type') == 'number') {
          if (val == '') {
            val = '0';
          }

          val = parseFloat(val);
        }
        if (attr == 'checked') {
          if (!(target.value instanceof Array)) {
            if (this.elem.checked) {
              val = true;
            } else {
              val = false;
            }
          } else if (this.elem.checked) {
              val = [...target.value, this.elem.name];
            } else {
              val = target.value.filter((t) => t != this.elem.name);
            }
        }

        target.set(val);
      });
    }

    return this;
  }

  /**
   * Allows u to attach a function that operates on the element when reactive value updates
   * @param {DominityReactive} target
   * @param {function} func
   * @returns {DominityElement}
   */
  binder(target, func, autocall = false) {
    if (target instanceof DominityReactive) {
      target.subscribe((d) => {
        func(this, d.value);
      }, autocall);
    }

    return this;
  }

  /**
   * Animate elements with animate method
   * @param {object} props
   * @param {number} duration
   * @param {string} [easing='linear']
   * @param {function} callback - function to run aftere the animation
   */
  animate(props, duration, easing = 'linear', callback) {
    const priorkeyframes = {};
    Object.keys(props).forEach((prop) => {
      if (props[prop] instanceof Array) {
        priorkeyframes[prop] = props[prop][0];
        props[prop] = props[prop][1];
      } else {
        priorkeyframes[prop] = this.style(prop);
      }
    });

    const animation = this.elem.animate([priorkeyframes, props], {
      duration: duration * 1000,
      easing,
      fill: 'forwards',
    });
    animation.onfinish = () => {
      this.style(props);
      if (typeof callback === 'function') {
        callback(this);
      }
    };

    return this;
  }

  //Actions
  /**
   * Focus or blurs an element depending on val true or not
   * @param {boolean} val -if true focuses else blurs
   * @returns {this}
   */
  focus(val = true) {
    if (val == true) {
      this.elem.focus();
    } else if (val == false) {
      this.elem.blur();
    }
    return this;
  }
  /**
   * Clicks an element
   * @returns {this}
   */
  click() {
    this.elem.click();

    return this;
  }
  /**
   * Scrolls to the element
   * @param {boolean|object} [s]- options/scroll
   * @see[scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
   * @returns {this}
   */
  scrollTo(s = true) {
    this.elem.scrollIntoView(s);
    return this;
  }
  /**
   * Gets the scroll position and size of the element
   * @returns {object}
   */
  getScrollInfo() {
    return {
      height: this.elem.scrollHeight,
      width: this.elem.scrollWidth,
      x: this.elem.scrollLeft,
      y: this.elem.scrollTop,
    };
  }

  /**
   * Returns elements size
   * @returns {getBoundingClientRect}
   */
  getSizeInfo() {
    return this.elem.getBoundingClientRect();
  }
  /**
   * Requests/cancels the element to be made fullscreen(cross browser compatible)
   * @param {boolean} val - if true to set an element to fullscreen ,false to make it normal
   * @returns {this}
   */
  fullScreen(val = true) {
    if (val == true) {
      if (this.elem.requestFullScreen) {
        this.elem.requestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullScreen) {
        this.elem.msRequestFullscreen();
      }
    } else if (this.elem.exitFullScreen) {
        this.elem.exitFullScreen();
      } else if (this.elem.webkitExitFullscreen) {
        this.elem.webkitExitFullscreen();
      } else if (this.elem.msExitFullScreen) {
        this.elem.msExitFullscreen();
      }

    return this;
  }
}

//Fuctions-------------------------

//El
/**
 * Creates a new element
 * @param {string} typ -valid html tagname of element
 * @param {string|object} txt-text inside the child element (if element doesnt have any text u can give an object of attribute here)
 * @param {object} attrs -objects with attribute value pairs
 * @param {HTMLElement} -target to be appended to (defaults to body)
 * @returns {DominityElement}
 * @see -`el()`
 * returned element is the created child so now u are working with this child to go back to working with parent chain `.$end()`
 */
function el(typ, txt = '', attrs = {}, target = document.body) {
  const element = document.createElement(typ);
  target.appendChild(element);
  const delement = new DominityElement(element);
  if (typeof txt === 'object') {
    delement.attr(txt);
  } else {
    delement.text(txt).attr(attrs);
  }
  return delement;
}

//Find
/**
 * Finds and return the element that matches the query
 * @param {string} qry -query to be matched
 * @returns {DominityElement}
 */
function $el(qry) {
  return new DominityElement(qry);
}
/**
 * Finds and returns all elements that match the query
 * @param {string} qry -query to be matched
 * @returns {DominityElement[]}
 */
function $$el(qry) {
  const elemArr = [];
  document.querySelectorAll(qry).forEach((e) => {
    elemArr.push(new DominityElement(e));
  });

  return elemArr;
}

//Reactable
/**
 * @class
 * a wrapper to hold reactive variables that can trigger subscribers
 *
 */
class DominityReactive {
  /**
   * Any variable to be made reactive
   * @param {any} value
   */
  constructor(value) {
    this.value = value;
    this.subscribers = [];
    this.name = '';
    this.linkLess = [];
  }
  /**
   * This is the name to be used inside `{{}}` when paired with `reactTo()`
   * @param {string} na
   * @returns {this}
   */
  as(na) {
    this.name = na;

    return this;
  }
  /**
   * Allows u to add subscriber functions , these functions are triggered whenever the value of reactable is updated
   * @param {function} callback
   * @param {boolean} autocall - to self update or not
   */
  subscribe(callback, autocall = 'true', isLinked = false) {
    this.subscribers.push(callback);
    if (!isLinked) {
      this.linkLess.push(callback);
    }
    if (autocall) {
      callback(this);
    }
  }
  /**
   * Allows you to get rid of a subscriber function
   * @param {function} callback -function to be removed
   */
  unsubscribe(callback) {
    this.subscribers.pop(subscribers.indexOf(callback));
  }
  /**
   * Used to set/update the value of the reactable
   * @param {any} newval
   */
  set(newval) {
    this.value = newval;
    this.update();
  }
  /**
   * Returns the value of reactable same as `reactable.value`
   * @param {string} [prop] -property of main reactable to be gotten
   * @returns {any}
   */
  get(prop = '') {
    if (prop != '') {
      return this.value[prop];
    } 
      return this.value;
    
  }
  /**
   * Sets a property of an object reactable
   * @param {string} prop -property to be set
   * @param {any} val -value to be set
   */
  setProp(prop, val) {
    this.value[prop] = val;
    this.update();
  }

  /**
   * Makes the reactable's vlaue dependant on other reactables
   * @param {reactive} reaction -whichever reactable u want it to be dependant on
   * @param {function} callback -this function is used to modify the dependancy ,u can run a process on dependant reactables value and the return of that is treated as the value of this reactable
   * @returns {this}
   */
  deriveFrom(reaction, callback) {
    if (reaction instanceof DominityReactive) {
      reaction.subscribe(() => {
        this.set(callback(reaction.value));
      });

      return this;
    }
    if (reaction instanceof Array) {
      reaction.forEach((re) => {
        re.subscribe(() => {
          this.set(callback(re.value));
        });
      });
      return this;
    }
  }
  link(parent, parentrelation, selfrelation) {
    parent.subscribe(() => {
      this.linkMsg(selfrelation(parent.value));
    }, true);
    const parentLink = (v) => {
      parent.linkMsg(parentrelation(v.value));
    };
    this.subscribe(parentLink, false, true);

    return this;
  }
  linkMsg(v) {
    this.value = v;
    this.update('linkLess');
  }

  /**
   * Forces all subscribers to be called
   */
  update(updater = 'subscribers') {
    this[updater].forEach((callback) => {
      callback(this);
    });
  }
}
/**
 * Creates and returns a new instance of reactive
 * @param {any} ini -value of the reactable
 * @returns {reactive} -reactive is returned
 */
function reactable(ini) {
  return new DominityReactive(ini);
}

/**
 * @class
 * used for client side routing
 *
 */
class DominityRouter {
  constructor(parentLayout) {
    this.path = this.getPath();
    this.defaultPath = '';
    this.defaultFile = '/index.html';
    this.routes = [];
    this.firstLoad = 0;
    this.params = {};

    this.parentLayout = parentLayout || el('div', { id: 'router-content' });
    this.backHandler = async () => {
      if (this.firstLoad && this.getPath() != this.defaultFile) {
        await this.handleRoute();
      } else {
        this.replaceRoute(this.defaultPath);
        this.firstLoad = 1;
      }
    };

    addEventListener('popstate', this.backHandler);

    addEventListener('load', this.backHandler);
  }
  /**
   * Assigns an element to a specific route in the dominity router
   * @param {string} route- route path name
   * @param {DominityElement} pageElement -component to be routed to
   * @param {*} [callback] - a function callback after routing optional
   * @returns {this}
   */
  register(route, pageElement, callback = () => {}) {
    const config = {
      route,
      elem: pageElement,
      callback,
      routeKey: reactable(false),
      element: { remove: () => {} },
    };
    this.routes.push(config);
    config.routeKey.subscribe((v) => {
      const elem = () => {
        const r = config.elem(this);
        config.element = r;
        return r;
      };

      if (v.value == true) {
        this.parentLayout._el(elem());
      } else {
        config.element.remove();
      }
    }, false);
    return this;
  }
  getPath() {
    return window.location.pathname;
  }

  async handleRoute() {
    let routeFound = 0;
    this.routes.forEach((routeObj) => {
      if (this.getPath() == routeObj.route) {
        routeObj.routeKey.set(true);
        routeFound = 1;
      } else {
        routeObj.routeKey.set(false);
      }
    });
  }
  /**
   * Routes to a specific route
   * @param {string} route -routename to be routed to
   */
  routeTo(route) {
    history.pushState(null, '', route);

    this.handleRoute();
  }
  /**
   * Replaces the current path with another
   * @param {string} route -new path
   */
  replaceRoute(route) {
    history.replaceState(null, '', route);
    this.handleRoute();
  }
  /**
   * Returns the search url prameters
   * @returns {object} object containig searchParams
   */
  getQueries() {
    return Object.fromEntries(
      new URLSearchParams(window.location.search).entries(),
    );
  }
  /**
   * A router link component
   * @param {string} text - text to be placed inside
   * @param {string} link -path
   * @param {boolean} replace -to replace or not off by default
   * @returns
   */

  Link(text, link, replace = false) {
    return el('a', text, { tabindex: 0, href: link }).onClick((s, e) => {
      e.preventDefault();
      if (replace) {
        this.replaceRoute(link);
      } else {
        this.routeTo(link);
      }
    });
  }
}
