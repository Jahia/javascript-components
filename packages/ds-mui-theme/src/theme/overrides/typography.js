// we use require and not import to not include the binary file to the generated *.umd.js
import NunitoSansRegular from "../../fonts/nunito-sans-v3-latin-regular.woff";
import NunitoSansRegular2 from "../../fonts/nunito-sans-v3-latin-regular.woff2";
import NunitoSansBold from "../../fonts/nunito-sans-v3-latin-600.woff";
import NunitoSansBold2 from "../../fonts/nunito-sans-v3-latin-600.woff2";
import NunitoSansLight from "../../fonts/nunito-sans-v3-latin-300.woff";
import NunitoSansLight2 from "../../fonts/nunito-sans-v3-latin-300.woff2";

var dsTypography = (theme) => (
    {
        "@font-face": [{
            fontFamily: 'Nunito Sans',
            fontWeight: '300',
            src: 'url(\'' + NunitoSansLight2 + '\') format(\'woff2\')',
            fallbacks: [{src: 'url(\'' + NunitoSansLight + '\') format(\'woff\')'}]
        },
        {
            fontFamily: 'Nunito Sans',
            fontWeight: '400',
            src: 'url(\'' + NunitoSansRegular2 + '\') format(\'woff2\')',
            fallbacks: [{src: 'url(\'' + NunitoSansRegular + '\') format(\'woff\')'}]
        },
        {
            fontFamily: 'Nunito Sans',
            fontWeight: '600',
            src: 'url(\'' + NunitoSansBold2 + '\') format(\'woff2\')',
            fallbacks: [{src: 'url(\'' + NunitoSansBold + '\') format(\'woff\')'}]
        }],
        "root" : {
            "color" : theme.palette.text.secondary,
        },
        "h5":{
            "color" : theme.palette.text.secondary
        },
        "h6":{
            "color" : theme.palette.text.secondary
        },
        "body1":{
            "color" : theme.palette.text.secondary
        },
        "body2":{
            "color" : theme.palette.text.secondary
        }
});

export {dsTypography}
