const form_inputs = document.querySelectorAll('.application__form__input')
const form = document.getElementById('form')
const error_indicator = document.getElementById('error_indicator')
const error_message = document.getElementById('error_message')

const cidr_field = document.getElementById('cidr-field')

const adresa_mreze = document.getElementById('adresa-mreze')
const subnet_mask = document.getElementById('subnet-mask')
const prva_korisna = document.getElementById('prva-korisna')
const zadnja_korsina = document.getElementById('zadnja-korsina')
const broadcast_adresa = document.getElementById('broadcast-adresa')

const errorMessages = {
    adresa: 'Greška. IP adresa koju ste unjeli je neispravna.',
    cidr: 'Greška. CIDR koji ste unjeli nije ispravan.'
}

error_msg = ""

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

                if (form.dataset.function == "subnet-details") {
                    printDetails()
                }
            }else {
                set_all_invalid()
                if (error_indicator.classList.contains("hide")) error_indicator.classList.remove("hide")
                if (error_message.classList.contains("hide")) error_message.classList.remove("hide")
                error_message.innerHTML = error_msg
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
function is_valid_cidr(value) {
    let value_ = parseInt(value)
    if (value_ <= 32 && value_ >= 0) return true
    return false
}


// Check if one of those are valid
function all_valid() {
    let decimal = true
    error_msg = ""
    form_inputs.forEach((el) => {
        if (el.dataset.type != "CIDR") {
            if (!is_valid_decimal(el.value)) {
                if (!error_msg.includes(errorMessages.adresa)) {
                    error_msg += errorMessages.adresa + " "
                }
                decimal = false;
            }
        }else {
            if (!is_valid_cidr(el.value)) {
                if (!error_msg.includes(errorMessages.cidr)) {
                    error_msg += errorMessages.cidr + " "
                }
                decimal = false;
            }
        }
    })
    return decimal
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



// To binary to decimal
function to_binary(value) {
    let binaryStr = parseInt(value).toString(2)
    return binaryStr.padStart(8, '0')
}

function to_decimal(value) {
    let decimal_num = parseInt(value, 2)
    return decimal_num
}


// Print details
function printDetails() {
    let subnet_addr = subnet_calc(cidr_field.value)
    let mreza_addr = addr_network_calc(cidr_field.value)
    let first_usable_addr = first_usable(binary_addr(cidr_field.value))
    let broadcast_addr = broadcast_calc(binary_addr(cidr_field.value)).join(".")
    let last_usable = last_calc(broadcast_calc(binary_addr(cidr_field.value)))
    subnet_mask.innerText = subnet_addr
    adresa_mreze.innerText = mreza_addr
    prva_korisna.innerText = first_usable_addr
    broadcast_adresa.innerText = broadcast_addr
    zadnja_korsina.innerText = last_usable
}

function broadcast_calc(value) {
    let cidr_val = cidr_field.value
    let value_raw = value.join("")
    let changed_address = ""
    let networkAddress = []

    for (let i = 0; i < 32; i++) {
        if (i >= cidr_val) changed_address += "1"
        else changed_address += value_raw[i]
    }

    let binary_groups = []
    for (let i = 0; i < changed_address.length; i += 8) {
        binary_groups.push(changed_address.slice(i, i + 8));
    }

    console.log(binary_groups)

    for (let i = 0; i < 4; i++) [
        networkAddress.push(to_decimal(binary_groups[i]))
    ]

    return networkAddress
}


function last_calc(value) {
    let cidr_val = cidr_field.value
    let networkAddress = []

    if (cidr_val == 32 || cidr_val == 31) return "N/A"

    value[3] = value[3] - 1;
    return value.join(".")
}

function addr_network_calc(value) {
    let network_addr = ""
    let network_binary_addr = binary_addr(value)
    
    for (let i = 0; i < 4; i++) {
        if (i < 3) {
            network_addr += to_decimal(network_binary_addr[i]) + "."
        }else {
            network_addr += to_decimal(network_binary_addr[i])
        }
    }
    return network_addr
}

function first_usable(value) {
    let cidr_val = cidr_field.value
    let networkAddress = []

    if (cidr_val == 32 || cidr_val == 31) return "N/A"

    for (let i = 0; i < 4; i++) [
        networkAddress.push(to_decimal(value[i]))
    ]

    if (cidr_field)
    networkAddress[3] = networkAddress[3] + 1;
    return networkAddress.join(".")
}

function binary_addr(value) {
    let b_addr = ""
    let binary_addres = []
    form_inputs.forEach((el) => {
        if (el.dataset.type != "CIDR") {
            b_addr += to_binary(el.value)
        }
    })

    let bitovi = 1
    binary_addr_part = ""
    for (let i = 0; i < 32; i++, bitovi++) {
        if (i < value) {
            binary_addr_part += b_addr[i]
        }else {
            binary_addr_part += 0
        }

        if (bitovi == 8) {
            binary_addres.push(binary_addr_part)
            binary_addr_part = ""
            bitovi = 0
        }
    }
    return binary_addres
}

function subnet_calc(value) {
    let bit_stream = ""
    let subnet_addr = ""
    let bitovi = 1
    let oktekt = 0
    for(let i = 0; i < 32; i++, bitovi++) {

        if (i < value) bit_stream += "1"
        else bit_stream += "0"

        if (bitovi >= 8) {
            bitovi = 0;

            if (oktekt < 3) {
                subnet_addr += to_decimal(bit_stream) + "."
            }else {
                subnet_addr += to_decimal(bit_stream)
            }

            oktekt++;
            bit_stream = ""
        }
    }
    return subnet_addr
}