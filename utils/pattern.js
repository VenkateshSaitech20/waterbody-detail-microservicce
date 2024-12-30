const patterns = {
    // name: /^[a-zA-Z\s]+$/,
    name: /^[a-zA-Z\s.\-:\/()]+$/,
    nameWithAlphaNumeric: /^[a-zA-Z0-9\s.\-:\/]+$/,
    emailPattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    mobile: /^(?!0{10})\d{10}$/,
    password: /^(?=.*[!@#$%^&*])(?=.*\d)[a-zA-Z\d!@#$%^&*]{6,}$/,
    question: /^[a-zA-Z0-9\s\?\-\(\)\'\"\/,&!]+$/,
    numWithDot: /^[0-9.]*$|^$/, // latitude and longitude
    nameWithComma: /^[a-zA-Z\s.,\-:\/()]+$/,
    number: /^[0-9]+$/, // number only
    numberString: /^\d*\.?\d*$/, // number string only

}
module.exports = { patterns };