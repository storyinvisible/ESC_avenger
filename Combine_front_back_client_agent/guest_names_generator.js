const generate_guest_name = () => {
    let capital_charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let charset = "abcdefghijklmnopqrstuvwxyz";
    let first_name = "";
    let last_name = "";
    let name_length = Math.floor(Math.random() * 10);

    // forming first name
    first_name += capital_charset[Math.floor(Math.random() * capital_charset.length)];
    for (let i = 1; i < name_length; i++) {
        first_name += charset[Math.floor(Math.random() * charset.length)];
    }

    // forming last name
    last_name += capital_charset[Math.floor(Math.random() * capital_charset.length)];
    for (let j = 0; j < name_length; j++) {
        last_name += charset[Math.floor(Math.random() * charset.length)];
    }

    let result = {
        guestFirstName: first_name,
        guestLastName: last_name
    };

    return result;
}

module.exports = {
    generate_guest_name
}