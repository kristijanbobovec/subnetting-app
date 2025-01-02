const form_inputs = document.querySelectorAll('.application__form__input')
const form = document.getElementById('form')
const error_indicator = document.getElementById('error_indicator')
const error_message = document.getElementById('error_message')

const oblik_adrese = document.getElementById("oblik_adrese")
const ispis_adrese = document.getElementById("ispis_adrese")

const errorMessages = {
    kombinacija: 'Greška. Kombinacija koju ste unjeli je neispravna.'
}

// Patterns
const binary_pattern = /^[01]{8}$/;

form_inputs.forEach((el) => {
    el.addEventListener('input', function(e) {
        // Auto width
        const currentValue = e.target.value;
        this.style.width = this.value.length + "ch";
        e.target.value = currentValue.replace(/\D/g, '');

        if (sve_popunjeno()) {
            if (all_valid()) {
                set_all_valid()
                if (!error_indicator.classList.contains("hide")) error_indicator.classList.add("hide")
                if (!error_message.classList.contains("hide")) error_message.classList.add("hide")
                error_message.innerHTML = ""

                if (form.dataset.function == "converter") {
                    convertValues()
                }
            }else {
                set_all_invalid()
                if (error_indicator.classList.contains("hide")) error_indicator.classList.remove("hide")
                if (error_message.classList.contains("hide")) error_message.classList.remove("hide")
                error_message.innerHTML = errorMessages.kombinacija
            }
        }
    })
});

// Is valid number for decimal ip address.
function is_valid_decimal(value) {
    let value_ = parseInt(value)
    if (value_ < 256 && value >= 0) return true
    return false;
}

// Is valid number for binary ip address.
function is_valid_binary(value) {
    if (binary_pattern.test(value)) return true
    return false
}


// Check if one of those are valid
function all_valid() {
    let binary = true
    let decimal = true
    form_inputs.forEach((el) => {
        if (!is_valid_binary(el.value)) binary = false;
        if (!is_valid_decimal(el.value)) decimal = false;
    })
    return binary || decimal
}

function sve_popunjeno() {
    let popunjeno = true
    form_inputs.forEach((el) => {
        if (el.value == "") { 
            popunjeno = false
        }
    })
    return popunjeno
}

function set_all_valid() {
    form_inputs.forEach((el) => {
        if (el.classList.contains("input--invalid")) el.classList.remove("input--invalid")
        el.classList.add("input--valid")
    })
}

function set_all_invalid() {
    form_inputs.forEach((el) => {
        if (el.classList.contains("input--valid")) el.classList.remove("input--valid")
        el.classList.add("input--invalid")
    })
}


// Converter
function convertValues() {
    let konverzije = 0
    let converted_string = ""

    let is_binary = false
    let is_decimal = false
    form_inputs.forEach((el) => {
        if (is_valid_decimal(el.value)) {
            let binarno = to_binary(el.value)
            is_binary = true
            if (konverzije < 3) {
                converted_string += binarno += "."
            }else {
                converted_string += binarno
            }
            konverzije++
        }
        else {
            is_decimal = true
            let decimalno = to_decimal(el.value)
            if (konverzije < 3) {
                converted_string += decimalno + "."
            }else {
                converted_string += decimalno
            }
            konverzije++
        }
    })
    console.log(converted_string)
    if (is_binary) {
        oblik_adrese.innerHTML = "binarnom"
        ispis_adrese.innerHTML = converted_string
    }else if (is_decimal) {
        oblik_adrese.innerHTML = "dekatskom"
        ispis_adrese.innerHTML = converted_string
    }
}

function to_binary(value) {
    let binaryStr = parseInt(value).toString(2)
    return binaryStr.padStart(8, '0')
}

function to_decimal(value) {
    let decimal_num = parseInt(value, 2)
    return decimal_num
}