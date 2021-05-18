export const parseUrl = (url, placeholders) => {
    let newUrl = url;
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(placeholders)) {
        const placeholder = new RegExp(`\\\$${key}`, 'g');
        newUrl = newUrl.replace(placeholder, value);
        console.log(placeholder, key, value, newUrl);
    }

    return newUrl;
};
