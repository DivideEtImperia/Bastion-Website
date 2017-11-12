/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  'use strict';

  /**
   * Class constructor for Slider MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */

  var MaterialSlider = function MaterialSlider(element) {
    this.element_ = element;
    // Browser feature detection.
    this.isIE_ = window.navigator.msPointerEnabled;
    // Initialize instance.
    this.init();
  };
  window['MaterialSlider'] = MaterialSlider;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialSlider.prototype.Constant_ = {
    // None for now.
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialSlider.prototype.CssClasses_ = {
    IE_CONTAINER: 'mdl-slider__ie-container',
    SLIDER_CONTAINER: 'mdl-slider__container',
    BACKGROUND_FLEX: 'mdl-slider__background-flex',
    BACKGROUND_LOWER: 'mdl-slider__background-lower',
    BACKGROUND_UPPER: 'mdl-slider__background-upper',
    IS_LOWEST_VALUE: 'is-lowest-value',
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Handle input on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialSlider.prototype.onInput_ = function (event) {
    this.updateValueStyles_();
  };

  /**
   * Handle change on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialSlider.prototype.onChange_ = function (event) {
    this.updateValueStyles_();
  };

  /**
   * Handle mouseup on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialSlider.prototype.onMouseUp_ = function (event) {
    event.target.blur();
  };

  /**
   * Handle mousedown on container element.
   * This handler is purpose is to not require the use to click
   * exactly on the 2px slider element, as FireFox seems to be very
   * strict about this.
   *
   * @param {Event} event The event that fired.
   * @private
   * @suppress {missingProperties}
   */
  MaterialSlider.prototype.onContainerMouseDown_ = function (event) {
    // If this click is not on the parent element (but rather some child)
    // ignore. It may still bubble up.
    if (event.target !== this.element_.parentElement) {
      return;
    }

    // Discard the original event and create a new event that
    // is on the slider element.
    event.preventDefault();
    var newEvent = new MouseEvent('mousedown', {
      target: event.target,
      buttons: event.buttons,
      clientX: event.clientX,
      clientY: this.element_.getBoundingClientRect().y
    });
    this.element_.dispatchEvent(newEvent);
  };

  /**
   * Handle updating of values.
   *
   * @private
   */
  MaterialSlider.prototype.updateValueStyles_ = function () {
    // Calculate and apply percentages to div structure behind slider.
    var fraction = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);

    if (fraction === 0) {
      this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
    }

    if (!this.isIE_) {
      this.backgroundLower_.style.flex = fraction;
      this.backgroundLower_.style.webkitFlex = fraction;
      this.backgroundUpper_.style.flex = 1 - fraction;
      this.backgroundUpper_.style.webkitFlex = 1 - fraction;
    }
  };

  // Public methods.

  /**
   * Disable slider.
   *
   * @public
   */
  MaterialSlider.prototype.disable = function () {
    this.element_.disabled = true;
  };
  MaterialSlider.prototype['disable'] = MaterialSlider.prototype.disable;

  /**
   * Enable slider.
   *
   * @public
   */
  MaterialSlider.prototype.enable = function () {

    this.element_.disabled = false;
  };
  MaterialSlider.prototype['enable'] = MaterialSlider.prototype.enable;

  /**
   * Update slider value.
   *
   * @param {number} value The value to which to set the control (optional).
   * @public
   */
  MaterialSlider.prototype.change = function (value) {

    if (typeof value !== 'undefined') {
      this.element_.value = value;
    }
    this.updateValueStyles_();
  };
  MaterialSlider.prototype['change'] = MaterialSlider.prototype.change;

  /**
   * Initialize element.
   */
  MaterialSlider.prototype.init = function () {

    if (this.element_) {
      if (this.isIE_) {
        // Since we need to specify a very large height in IE due to
        // implementation limitations, we add a parent here that trims it down to
        // a reasonable size.
        var containerIE = document.createElement('div');
        containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
        this.element_.parentElement.insertBefore(containerIE, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        containerIE.appendChild(this.element_);
      } else {
        // For non-IE browsers, we need a div structure that sits behind the
        // slider and allows us to style the left and right sides of it with
        // different colors.
        var container = document.createElement('div');
        container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
        this.element_.parentElement.insertBefore(container, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        container.appendChild(this.element_);
        var backgroundFlex = document.createElement('div');
        backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
        container.appendChild(backgroundFlex);
        this.backgroundLower_ = document.createElement('div');
        this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
        backgroundFlex.appendChild(this.backgroundLower_);
        this.backgroundUpper_ = document.createElement('div');
        this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
        backgroundFlex.appendChild(this.backgroundUpper_);
      }

      this.boundInputHandler = this.onInput_.bind(this);
      this.boundChangeHandler = this.onChange_.bind(this);
      this.boundMouseUpHandler = this.onMouseUp_.bind(this);
      this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
      this.element_.addEventListener('input', this.boundInputHandler);
      this.element_.addEventListener('change', this.boundChangeHandler);
      this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
      this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);

      this.updateValueStyles_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialSlider,
    classAsString: 'MaterialSlider',
    cssClass: 'mdl-js-slider',
    widget: true
  });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlci5qcyJdLCJuYW1lcyI6WyJNYXRlcmlhbFNsaWRlciIsImVsZW1lbnQiLCJlbGVtZW50XyIsImlzSUVfIiwid2luZG93IiwibmF2aWdhdG9yIiwibXNQb2ludGVyRW5hYmxlZCIsImluaXQiLCJwcm90b3R5cGUiLCJDb25zdGFudF8iLCJDc3NDbGFzc2VzXyIsIklFX0NPTlRBSU5FUiIsIlNMSURFUl9DT05UQUlORVIiLCJCQUNLR1JPVU5EX0ZMRVgiLCJCQUNLR1JPVU5EX0xPV0VSIiwiQkFDS0dST1VORF9VUFBFUiIsIklTX0xPV0VTVF9WQUxVRSIsIklTX1VQR1JBREVEIiwib25JbnB1dF8iLCJldmVudCIsInVwZGF0ZVZhbHVlU3R5bGVzXyIsIm9uQ2hhbmdlXyIsIm9uTW91c2VVcF8iLCJ0YXJnZXQiLCJibHVyIiwib25Db250YWluZXJNb3VzZURvd25fIiwicGFyZW50RWxlbWVudCIsInByZXZlbnREZWZhdWx0IiwibmV3RXZlbnQiLCJNb3VzZUV2ZW50IiwiYnV0dG9ucyIsImNsaWVudFgiLCJjbGllbnRZIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieSIsImRpc3BhdGNoRXZlbnQiLCJmcmFjdGlvbiIsInZhbHVlIiwibWluIiwibWF4IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiYmFja2dyb3VuZExvd2VyXyIsInN0eWxlIiwiZmxleCIsIndlYmtpdEZsZXgiLCJiYWNrZ3JvdW5kVXBwZXJfIiwiZGlzYWJsZSIsImRpc2FibGVkIiwiZW5hYmxlIiwiY2hhbmdlIiwiY29udGFpbmVySUUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbnNlcnRCZWZvcmUiLCJyZW1vdmVDaGlsZCIsImFwcGVuZENoaWxkIiwiY29udGFpbmVyIiwiYmFja2dyb3VuZEZsZXgiLCJib3VuZElucHV0SGFuZGxlciIsImJpbmQiLCJib3VuZENoYW5nZUhhbmRsZXIiLCJib3VuZE1vdXNlVXBIYW5kbGVyIiwiYm91bmRDb250YWluZXJNb3VzZURvd25IYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbXBvbmVudEhhbmRsZXIiLCJyZWdpc3RlciIsImNvbnN0cnVjdG9yIiwiY2xhc3NBc1N0cmluZyIsImNzc0NsYXNzIiwid2lkZ2V0Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsQ0FBQyxZQUFXO0FBQ1Y7O0FBRUE7Ozs7Ozs7OztBQVFBLE1BQUlBLGlCQUFpQixTQUFTQSxjQUFULENBQXdCQyxPQUF4QixFQUFpQztBQUNwRCxTQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjtBQUNBO0FBQ0EsU0FBS0UsS0FBTCxHQUFhQyxPQUFPQyxTQUFQLENBQWlCQyxnQkFBOUI7QUFDQTtBQUNBLFNBQUtDLElBQUw7QUFDRCxHQU5EO0FBT0FILFNBQU8sZ0JBQVAsSUFBMkJKLGNBQTNCOztBQUVBOzs7Ozs7QUFNQUEsaUJBQWVRLFNBQWYsQ0FBeUJDLFNBQXpCLEdBQXFDO0FBQ25DO0FBRG1DLEdBQXJDOztBQUlBOzs7Ozs7OztBQVFBVCxpQkFBZVEsU0FBZixDQUF5QkUsV0FBekIsR0FBdUM7QUFDckNDLGtCQUFjLDBCQUR1QjtBQUVyQ0Msc0JBQWtCLHVCQUZtQjtBQUdyQ0MscUJBQWlCLDZCQUhvQjtBQUlyQ0Msc0JBQWtCLDhCQUptQjtBQUtyQ0Msc0JBQWtCLDhCQUxtQjtBQU1yQ0MscUJBQWlCLGlCQU5vQjtBQU9yQ0MsaUJBQWE7QUFQd0IsR0FBdkM7O0FBVUE7Ozs7OztBQU1BakIsaUJBQWVRLFNBQWYsQ0FBeUJVLFFBQXpCLEdBQW9DLFVBQVNDLEtBQVQsRUFBZ0I7QUFDbEQsU0FBS0Msa0JBQUw7QUFDRCxHQUZEOztBQUlBOzs7Ozs7QUFNQXBCLGlCQUFlUSxTQUFmLENBQXlCYSxTQUF6QixHQUFxQyxVQUFTRixLQUFULEVBQWdCO0FBQ25ELFNBQUtDLGtCQUFMO0FBQ0QsR0FGRDs7QUFJQTs7Ozs7O0FBTUFwQixpQkFBZVEsU0FBZixDQUF5QmMsVUFBekIsR0FBc0MsVUFBU0gsS0FBVCxFQUFnQjtBQUNwREEs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QUFhcEUsY0FEVztBQUV4QnFFLG1CQUFlLGdCQUZTO0FBR3hCQyxjQUFVLGVBSGM7QUFJeEJDLFlBQVE7QUFKZ0IsR0FBMUI7QUFNRCxDQWxPRCIsImZpbGUiOiJzbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBTbGlkZXIgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbiAgdmFyIE1hdGVyaWFsU2xpZGVyID0gZnVuY3Rpb24gTWF0ZXJpYWxTbGlkZXIoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuICAgIC8vIEJyb3dzZXIgZmVhdHVyZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5pc0lFXyA9IHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZDtcbiAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuICB3aW5kb3dbJ01hdGVyaWFsU2xpZGVyJ10gPSBNYXRlcmlhbFNsaWRlcjtcblxuICAvKipcbiAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5Db25zdGFudF8gPSB7XG4gICAgLy8gTm9uZSBmb3Igbm93LlxuICB9O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLkNzc0NsYXNzZXNfID0ge1xuICAgIElFX0NPTlRBSU5FUjogJ21kbC1zbGlkZXJfX2llLWNvbnRhaW5lcicsXG4gICAgU0xJREVSX0NPTlRBSU5FUjogJ21kbC1zbGlkZXJfX2NvbnRhaW5lcicsXG4gICAgQkFDS0dST1VORF9GTEVYOiAnbWRsLXNsaWRlcl9fYmFja2dyb3VuZC1mbGV4JyxcbiAgICBCQUNLR1JPVU5EX0xPV0VSOiAnbWRsLXNsaWRlcl9fYmFja2dyb3VuZC1sb3dlcicsXG4gICAgQkFDS0dST1VORF9VUFBFUjogJ21kbC1zbGlkZXJfX2JhY2tncm91bmQtdXBwZXInLFxuICAgIElTX0xPV0VTVF9WQUxVRTogJ2lzLWxvd2VzdC12YWx1ZScsXG4gICAgSVNfVVBHUkFERUQ6ICdpcy11cGdyYWRlZCdcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGlucHV0IG9uIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLm9uSW5wdXRfID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlU3R5bGVzXygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgY2hhbmdlIG9uIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLm9uQ2hhbmdlXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy51cGRhdGVWYWx1ZVN0eWxlc18oKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIG1vdXNldXAgb24gZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGUub25Nb3VzZVVwXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQudGFyZ2V0LmJsdXIoKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIG1vdXNlZG93biBvbiBjb250YWluZXIgZWxlbWVudC5cbiAgICogVGhpcyBoYW5kbGVyIGlzIHB1cnBvc2UgaXMgdG8gbm90IHJlcXVpcmUgdGhlIHVzZSB0byBjbGlja1xuICAgKiBleGFjdGx5IG9uIHRoZSAycHggc2xpZGVyIGVsZW1lbnQsIGFzIEZpcmVGb3ggc2VlbXMgdG8gYmUgdmVyeVxuICAgKiBzdHJpY3QgYWJvdXQgdGhpcy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqIEBzdXBwcmVzcyB7bWlzc2luZ1Byb3BlcnRpZXN9XG4gICAqL1xuICBNYXRlcmlhbFNsaWRlci5wcm90b3R5cGUub25Db250YWluZXJNb3VzZURvd25fID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAvLyBJZiB0aGlzIGNsaWNrIGlzIG5vdCBvbiB0aGUgcGFyZW50IGVsZW1lbnQgKGJ1dCByYXRoZXIgc29tZSBjaGlsZClcbiAgICAvLyBpZ25vcmUuIEl0IG1heSBzdGlsbCBidWJibGUgdXAuXG4gICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGlzY2FyZCB0aGUgb3JpZ2luYWwgZXZlbnQgYW5kIGNyZWF0ZSBhIG5ldyBldmVudCB0aGF0XG4gICAgLy8gaXMgb24gdGhlIHNsaWRlciBlbGVtZW50LlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIG5ld0V2ZW50ID0gbmV3IE1vdXNlRXZlbnQoJ21vdXNlZG93bicsIHtcbiAgICAgIHRhcmdldDogZXZlbnQudGFyZ2V0LFxuICAgICAgYnV0dG9uczogZXZlbnQuYnV0dG9ucyxcbiAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICBjbGllbnRZOiB0aGlzLmVsZW1lbnRfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnlcbiAgICB9KTtcbiAgICB0aGlzLmVsZW1lbnRfLmRpc3BhdGNoRXZlbnQobmV3RXZlbnQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgdXBkYXRpbmcgb2YgdmFsdWVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLnVwZGF0ZVZhbHVlU3R5bGVzXyA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIENhbGN1bGF0ZSBhbmQgYXBwbHkgcGVyY2VudGFnZXMgdG8gZGl2IHN0cnVjdHVyZSBiZWhpbmQgc2xpZGVyLlxuICAgIHZhciBmcmFjdGlvbiA9ICh0aGlzLmVsZW1lbnRfLnZhbHVlIC0gdGhpcy5lbGVtZW50Xy5taW4pIC9cbiAgICAgICAgKHRoaXMuZWxlbWVudF8ubWF4IC0gdGhpcy5lbGVtZW50Xy5taW4pO1xuXG4gICAgaWYgKGZyYWN0aW9uID09PSAwKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19MT1dFU1RfVkFMVUUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19MT1dFU1RfVkFMVUUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc0lFXykge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kTG93ZXJfLnN0eWxlLmZsZXggPSBmcmFjdGlvbjtcbiAgICAgIHRoaXMuYmFja2dyb3VuZExvd2VyXy5zdHlsZS53ZWJraXRGbGV4ID0gZnJhY3Rpb247XG4gICAgICB0aGlzLmJhY2tncm91bmRVcHBlcl8uc3R5bGUuZmxleCA9IDEgLSBmcmFjdGlvbjtcbiAgICAgIHRoaXMuYmFja2dyb3VuZFVwcGVyXy5zdHlsZS53ZWJraXRGbGV4ID0gMSAtIGZyYWN0aW9uO1xuICAgIH1cbiAgfTtcblxuICAvLyBQdWJsaWMgbWV0aG9kcy5cblxuICAvKipcbiAgICogRGlzYWJsZSBzbGlkZXIuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGVtZW50Xy5kaXNhYmxlZCA9IHRydWU7XG4gIH07XG4gIE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZVsnZGlzYWJsZSddID0gTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlLmRpc2FibGU7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBzbGlkZXIuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuZWxlbWVudF8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfTtcbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlWydlbmFibGUnXSA9IE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5lbmFibGU7XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBzbGlkZXIgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd2hpY2ggdG8gc2V0IHRoZSBjb250cm9sIChvcHRpb25hbCkuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5jaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuZWxlbWVudF8udmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVWYWx1ZVN0eWxlc18oKTtcbiAgfTtcbiAgTWF0ZXJpYWxTbGlkZXIucHJvdG90eXBlWydjaGFuZ2UnXSA9IE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5jaGFuZ2U7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsU2xpZGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgaWYgKHRoaXMuaXNJRV8pIHtcbiAgICAgICAgLy8gU2luY2Ugd2UgbmVlZCB0byBzcGVjaWZ5IGEgdmVyeSBsYXJnZSBoZWlnaHQgaW4gSUUgZHVlIHRvXG4gICAgICAgIC8vIGltcGxlbWVudGF0aW9uIGxpbWl0YXRpb25zLCB3ZSBhZGQgYSBwYXJlbnQgaGVyZSB0aGF0IHRyaW1zIGl0IGRvd24gdG9cbiAgICAgICAgLy8gYSByZWFzb25hYmxlIHNpemUuXG4gICAgICAgIHZhciBjb250YWluZXJJRSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250YWluZXJJRS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSUVfQ09OVEFJTkVSKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShjb250YWluZXJJRSwgdGhpcy5lbGVtZW50Xyk7XG4gICAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgY29udGFpbmVySUUuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50Xyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igbm9uLUlFIGJyb3dzZXJzLCB3ZSBuZWVkIGEgZGl2IHN0cnVjdHVyZSB0aGF0IHNpdHMgYmVoaW5kIHRoZVxuICAgICAgICAvLyBzbGlkZXIgYW5kIGFsbG93cyB1cyB0byBzdHlsZSB0aGUgbGVmdCBhbmQgcmlnaHQgc2lkZXMgb2YgaXQgd2l0aFxuICAgICAgICAvLyBkaWZmZXJlbnQgY29sb3JzLlxuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uU0xJREVSX0NPTlRBSU5FUik7XG4gICAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY29udGFpbmVyLCB0aGlzLmVsZW1lbnRfKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50Xyk7XG4gICAgICAgIHZhciBiYWNrZ3JvdW5kRmxleCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBiYWNrZ3JvdW5kRmxleC5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQkFDS0dST1VORF9GTEVYKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJhY2tncm91bmRGbGV4KTtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kTG93ZXJfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZExvd2VyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQkFDS0dST1VORF9MT1dFUik7XG4gICAgICAgIGJhY2tncm91bmRGbGV4LmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZExvd2VyXyk7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZFVwcGVyXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmJhY2tncm91bmRVcHBlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkJBQ0tHUk9VTkRfVVBQRVIpO1xuICAgICAgICBiYWNrZ3JvdW5kRmxleC5hcHBlbmRDaGlsZCh0aGlzLmJhY2tncm91bmRVcHBlcl8pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmJvdW5kSW5wdXRIYW5kbGVyID0gdGhpcy5vbklucHV0Xy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZENoYW5nZUhhbmRsZXIgPSB0aGlzLm9uQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZE1vdXNlVXBIYW5kbGVyID0gdGhpcy5vbk1vdXNlVXBfLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmJvdW5kQ29udGFpbmVyTW91c2VEb3duSGFuZGxlciA9IHRoaXMub25Db250YWluZXJNb3VzZURvd25fLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5ib3VuZElucHV0SGFuZGxlcik7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuYm91bmRDaGFuZ2VIYW5kbGVyKTtcbiAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuYm91bmRNb3VzZVVwSGFuZGxlcik7XG4gICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5ib3VuZENvbnRhaW5lck1vdXNlRG93bkhhbmRsZXIpO1xuXG4gICAgICB0aGlzLnVwZGF0ZVZhbHVlU3R5bGVzXygpO1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVVBHUkFERUQpO1xuICAgIH1cbiAgfTtcblxuICAvLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbiAgLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbiAgY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsU2xpZGVyLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbFNsaWRlcicsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtc2xpZGVyJyxcbiAgICB3aWRnZXQ6IHRydWVcbiAgfSk7XG59KSgpO1xuIl19