// We use require and not import to not include the binary file to the generated *.umd.js
import NunitoSansRegular from '../../../../resources/fonts/nunito-sans-v3-latin-regular.woff';
import NunitoSansRegular2 from '../../../../resources/fonts/nunito-sans-v3-latin-regular.woff2';
import NunitoSansRegularTtf from '../../../../resources/fonts/nunito-sans-v3-latin-regular.ttf';
import NunitoSansRegularEot from '../../../../resources/fonts/nunito-sans-v3-latin-regular.eot';
import NunitoSansBold from '../../../../resources/fonts/nunito-sans-v3-latin-700.woff';
import NunitoSansBold2 from '../../../../resources/fonts/nunito-sans-v3-latin-700.woff2';
import NunitoSansBoldTtf from '../../../../resources/fonts/nunito-sans-v3-latin-700.ttf';
import NunitoSansBoldEot from '../../../../resources/fonts/nunito-sans-v3-latin-700.eot';
import NunitoSansLight from '../../../../resources/fonts/nunito-sans-v3-latin-300.woff';
import NunitoSansLight2 from '../../../../resources/fonts/nunito-sans-v3-latin-300.woff2';
import NunitoSansLightTtf from '../../../../resources/fonts/nunito-sans-v3-latin-300.ttf';
import NunitoSansLightEot from '../../../../resources/fonts/nunito-sans-v3-latin-300.eot';

const anthraciteTypography = () => ({
    '@font-face': [
        {
            fontFamily: 'Nunito Sans',
            fontWeight: '300',
            src: [
                'url(\'' + NunitoSansLight2 + '\') format(\'woff2\')',
                'url(\'' + NunitoSansLight + '\') format(\'woff\')',
                'url(\'' + NunitoSansLightTtf + '\') format(\'truetype\')',
                'url(\'' + NunitoSansLightEot + '\') format(\'embedded-opentype\')'
            ]
        },
        {
            fontFamily: 'Nunito Sans',
            fontWeight: '400',
            src: [
                'url(\'' + NunitoSansRegular2 + '\') format(\'woff2\')',
                'url(\'' + NunitoSansRegular + '\') format(\'woff\')',
                'url(\'' + NunitoSansRegularTtf + '\') format(\'truetype\')',
                'url(\'' + NunitoSansRegularEot + '\') format(\'embedded-opentype\')'
            ]
        },
        {
            fontFamily: 'Nunito Sans',
            fontWeight: '700',
            src: [
                'url(\'' + NunitoSansBold2 + '\') format(\'woff2\')',
                'url(\'' + NunitoSansBold + '\') format(\'woff\')',
                'url(\'' + NunitoSansBoldTtf + '\') format(\'truetype\')',
                'url(\'' + NunitoSansBoldEot + '\') format(\'embedded-opentype\')'
            ]
        }
    ]
});

export {anthraciteTypography};
