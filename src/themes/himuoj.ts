import {
  type BrandVariants,
  type Theme,
  createLightTheme,
  createDarkTheme,
} from '@fluentui/react-components';

export const himuojBrand: BrandVariants = {
  10: '#060202',
  20: '#231211',
  30: '#3C1B1B',
  40: '#512122',
  50: '#67272A',
  60: '#7E2E32',
  70: '#95343A',
  80: '#AD3A42',
  90: '#C5404A',
  100: '#DE4653',
  110: '#EC5A62',
  120: '#F27275',
  130: '#F78988',
  140: '#FB9F9D',
  150: '#FEB4B1',
  160: '#FFCAC7',
};

export const himuojLightTheme: Theme = {
  ...createLightTheme(himuojBrand),
};

export const himuojDarkTheme: Theme = {
  ...createDarkTheme(himuojBrand),
};

himuojDarkTheme.colorBrandForeground1 = himuojBrand[110];
 himuojDarkTheme.colorBrandForeground2 = himuojBrand[120];
