/*!
 * Copyright (c) 2020 Victor Mayorov <webm0fe@yandex.ru>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['@zonikj/validatejs'] = global['@zonikj/validatejs'] || {})));
}(this, (function (exports) { 'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return fn;
}

var lang = {
  'ru-RU': {
    'empty': 'Пожалуйста, заполните поле',
    'incorrectPhone': 'Пожалуйста, введите корректный номер',
    'phoneCode': 'Пожалуйста, введите корректный код региона'
  },
  'en-EN': {
    'empty': 'Please fill in the field',
    'incorrectPhone': 'Please enter a valid phone number',
    'phoneCode': 'Please enter the correct region code'
  }
};

var _setup = new WeakSet();

var _validate = new WeakSet();

var Validate = /*#__PURE__*/function () {
  function Validate(selector, options) {
    _classCallCheck(this, Validate);

    _validate.add(this);

    _setup.add(this);

    this.$el = document.querySelectorAll(selector);
    this.options = options;

    _classPrivateMethodGet(this, _setup, _setup2).call(this);
  }
  /**
   * TODO: Собираем данные для отправки
   * @param {*} form 
   */


  _createClass(Validate, [{
    key: "serialize",
    value: function serialize(form) {
      var formData = new FormData();
      new FormData(form).forEach(function (value, key) {
        formData.append(key, value);
      });
      return formData;
    }
    /**
     * TODO: Проверяем валидность номера телефона
     * @param {*} input 
     */

  }, {
    key: "isInvalidPhoneNumber",
    value: function isInvalidPhoneNumber(input) {
      var numbers = input.value.match(/\d+/g).join('');
      var length = numbers.length;
      if (length > 11) input.value = input.value.substring(0, input.value.length - 1);
      return numbers.length < 11;
    }
    /**
     * TODO: Проверяем валидность код региона
     * @param {*} input 
     */

  }, {
    key: "isInvalidRegion",
    value: function isInvalidRegion(input) {
      var codes = ['904', '900', '901', '902', '903', '905', '906', '908', '909', '910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '920', '921', '922', '923', '924', '925', '926', '927', '928', '929', '930', '931', '932', '933', '934', '936', '937', '938', '939', '950', '951', '952', '953', '958', '960', '961', '962', '963', '964', '965', '966', '967', '968', '969', '978', '980', '981', '982', '983', '984', '985', '986', '987', '988', '989', '992', '994', '995', '996', '997', '999'];
      var code = input.value.match(/9\d{2}/);
      return code ? codes.indexOf(code[0]) === -1 : true;
    }
    /**
     * TODO: Проверяем поля на валидность
     * @param {*} input 
     */

  }, {
    key: "checkField",
    value: function checkField(input) {
      var parent = input.closest(this.options.parent);

      if (input.value.length === 0) {
        return 1;
      } else if (input.type === 'tel' && this.isInvalidPhoneNumber(input)) {
        return 2;
      } else if (input.type === 'tel' && this.isInvalidRegion(input)) {
        return 3;
      }

      return true;
    }
    /**
     * TODO: Валидация формы
     * @param {*} form 
     */

  }, {
    key: "formValidate",
    value: function formValidate(form) {
      var _this = this;

      var fields = form.querySelectorAll(this.options.requiredClasses);
      var errors = 0;
      fields.forEach(function (el) {
        var parent = el.closest(_this.options.parent);
        var hasError = false;

        if (el.getAttribute('type') == 'tel' || el.getAttribute('type') == 'text' || el.getAttribute('type') == 'email') {
          switch (_this.checkField(el)) {
            case 1:
              errors++;
              parent.classList.add(_this.options.errorClass);
              lang[_this.options.lang] ? alert(lang[_this.options.lang].empty) : null;
              return;
              break;

            case 2:
              errors++;
              parent.classList.add(_this.options.errorClass);
              lang[_this.options.lang] ? alert(lang[_this.options.lang].incorrectPhone) : null;
              return;
              break;

            case 3:
              errors++;
              parent.classList.add(_this.options.errorClass);
              lang[_this.options.lang] ? alert(lang[_this.options.lang].codePhone) : null;
              return;
              break;
          }
        } else if (el.dataset.type == 'checkbox') {
          if (!el.checked) {
            errors++;
            hasError = true;
            alert('Вам нужно согласиться на обработку персональных данных');
          }
        } else {
          if (el.value.length) {
            hasError = true;
          }
        }

        parent.classList.remove(_this.options.errorClass);
      });
      /**
       * TODO: Подсказка юзерам где ошибки
       */

      if (errors !== 0) {
        form.querySelector(".".concat(this.options.errorClass, " input")).focus();
        return false;
      }

      fields.forEach(function (el) {
        if (el.dataset.type !== 'hidden') el.value = '';
      });
      return true;
    }
  }]);

  return Validate;
}();

var _setup2 = function _setup2() {
  var validateObject = [].slice.call(this.$el);

  if (validateObject.length === 0) {
    throw Error('Элемент с классом: ' + this.options.selector + ' не было найдено.');
  }

  _classPrivateMethodGet(this, _validate, _validate2).call(this);
};

var _validate2 = function _validate2() {
  var _this2 = this;

  var phoneRegex = /[0-9]{1} \([0-9]{3}\) [0-9]{3} - [0-9]{2}\ - [0-9]{2}/g;
  var tels = document.querySelectorAll(this.options.isPhoneInput);
  tels.forEach(function (tel) {
    var mask = new IMask(tel, _this2.phoneMask, {
      dispatch: function dispatch(appended, dynamicMasked) {
        var number = (dynamicMasked.value + appended).replace(/\D/g, '');
        return dynamicMasked.compiledMasks.find(function (m) {
          return number.indexOf(m.startsWith) === 0;
        });
      }
    });
    tel.addEventListener('change', function (e) {
      var result = e.target.value.match(phoneRegex);

      if (!!result) {
        e.target.value = '';
      }
    });
  });
  this.$el.forEach(function (el) {
    el.addEventListener('submit', function (e) {
      e.preventDefault();

      if (_this2.formValidate(e.target)) {
        _this2.options.send ? _this2.options.send(e.target, _this2.serialize(e.target)) : null;
        _this2.options.success ? _this2.options.success(e.target) : null;
      } else {
        _this2.options.error ? _this2.options.error(e.target) : null;
      }

      return false;
    });
  });
};

exports.Validate = Validate;

Object.defineProperty(exports, '__esModule', { value: true });

})));
