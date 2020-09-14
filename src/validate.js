const lang = {
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
}

export class Validate {
  constructor(selector, options) {
    this.$el = document.querySelectorAll(selector)
    this.options = options

    this.#setup()
  }


  /**
   * TODO: Собираем данные для отправки
   * @param {*} form 
   */
  serialize(form) {
    let formData = new FormData()
    new FormData(form).forEach(function (value, key) {
      formData.append(key, value)
    })

    return formData
  }

  /**
   * TODO: Проверяем валидность номера телефона
   * @param {*} input 
   */
  isInvalidPhoneNumber(input) {
    const numbers = input.value.match(/\d+/g).join('')
    const length = numbers.length
    if (length > 11) input.value = input.value.substring(0, input.value.length - 1)
    return numbers.length < 11
  }

  /**
   * TODO: Проверяем валидность код региона
   * @param {*} input 
   */
  isInvalidRegion(input) {
    const codes = ['904', '900', '901', '902', '903', '905', '906', '908', '909', '910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '920', '921', '922', '923', '924', '925', '926', '927', '928', '929', '930', '931', '932', '933', '934', '936', '937', '938', '939', '950', '951', '952', '953', '958', '960', '961', '962', '963', '964', '965', '966', '967', '968', '969', '978', '980', '981', '982', '983', '984', '985', '986', '987', '988', '989', '992', '994', '995', '996', '997', '999']
    let code = input.value.match(/9\d{2}/)

    return code ? codes.indexOf(code[0]) === -1 : true
  }


  /**
   * TODO: Проверяем поля на валидность
   * @param {*} input 
   */
  checkField(input) {
    const parent = input.closest(this.options.parent)

    if (input.value.length === 0) {
      return 1
    } else if (input.type === 'tel' && this.isInvalidPhoneNumber(input)) {
      return 2
    } else if (input.type === 'tel' && this.isInvalidRegion(input)) {
      return 3
    }
    return true
  }

  /**
   * TODO: Валидация формы
   * @param {*} form 
   */
  formValidate(form) {
    const fields = form.querySelectorAll(this.options.requiredClasses)

    let errors = 0

    fields.forEach(el => {
      const parent = el.closest(this.options.parent)
      let hasError = false

      if (el.getAttribute('type') == 'tel' || el.getAttribute('type') == 'text' || el.getAttribute('type') == 'email') {
        switch (this.checkField(el)) {
          case 1:
            errors++
            parent.classList.add(this.options.errorClass)
            lang[this.options.lang] ? alert(lang[this.options.lang].empty) : null
            return
            break
          case 2:
            errors++
            parent.classList.add(this.options.errorClass)
            lang[this.options.lang] ? alert(lang[this.options.lang].incorrectPhone) : null
            return
            break
          case 3:
            errors++
            parent.classList.add(this.options.errorClass)
            lang[this.options.lang] ? alert(lang[this.options.lang].codePhone) : null
            return
            break
        }
      } else if (el.dataset.type == 'checkbox') {
        if (!el.checked) {
          errors++
          hasError = true
          alert('Вам нужно согласиться на обработку персональных данных')
        }
      } else {
        if (el.value.length) {
          hasError = true
        }
      }

      parent.classList.remove(this.options.errorClass)
    })

    /**
     * TODO: Подсказка юзерам где ошибки
     */
    if (errors !== 0) {
      form.querySelector(`.${this.options.errorClass} input`).focus()
      return false
    }

    fields.forEach(el => {
      if (el.dataset.type !== 'hidden') el.value = ''
    })

    return true
  }

  #setup() {
    const validateObject = [].slice.call(this.$el)

    if (validateObject.length === 0) {
      throw Error('Элемент с классом: ' + this.options.selector + ' не было найдено.')
    }

    this.#validate()
  }

  #validate() {
    const phoneRegex = /[0-9]{1} \([0-9]{3}\) [0-9]{3} - [0-9]{2}\ - [0-9]{2}/g
    const tels = document.querySelectorAll(this.options.isPhoneInput)

    tels.forEach(tel => {
      const mask = new IMask(tel, this.phoneMask, {
        dispatch: function (appended, dynamicMasked) {
          const number = (dynamicMasked.value + appended).replace(/\D/g, '')

          return dynamicMasked.compiledMasks.find(function (m) {
            return number.indexOf(m.startsWith) === 0
          })
        }
      })

      tel.addEventListener('change', (e) => {
        const result = e.target.value.match(phoneRegex)

        if (!!result) {
          e.target.value = ''
        }
      })
    })

    this.$el.forEach(el => {
      el.addEventListener('submit', e => {
        e.preventDefault()

        if (this.formValidate(e.target)) {
          this.options.send ? this.options.send(e.target, this.serialize(e.target)) : null
          this.options.success ? this.options.success(e.target) : null
        } else {
          this.options.error ? this.options.error(e.target) : null
        }
        return false
      })
    })
  }
}