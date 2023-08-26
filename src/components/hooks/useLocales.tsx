import { useMemo } from 'react';

import { useStore } from '../context/createFastContext';
import { PageAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const useLocales = () => {
  const sdk = useSDK<PageAppSDK>();
  const [_enabledLocales, setEnabledLocales] = useStore(
    (store) => store['enabledLocales']
  );
  const enabledLocales = useMemo(() => {
    const enabledLocalesParam = _enabledLocales ??
      sdk.parameters?.instance?.enabledLocales ?? [sdk.locales.default];
    if (enabledLocalesParam.length < 1) {
      setEnabledLocales({
        enabledLocales: [sdk.locales.default],
      });
    }
    if (!enabledLocalesParam.includes(sdk.locales.default)) {
      setEnabledLocales({
        enabledLocales: [sdk.locales.default, ...enabledLocalesParam],
      });
    }
    return enabledLocalesParam;
  }, [
    _enabledLocales,
    sdk.locales?.default,
    sdk.parameters?.instance?.enabledLocales,
    setEnabledLocales,
  ]);

  const changeLocaleVisibility = (locale, isVisible) => {
    if (isVisible) {
      setEnabledLocales({
        enabledLocales: [...enabledLocales, locale],
      });
    } else {
      setEnabledLocales({
        enabledLocales: enabledLocales.filter(
          (enabledLocale) => enabledLocale !== locale
        ),
      });
    }
  };

  return {
    localeNames: sdk.locales.names,
    defaultLocale: sdk.locales.default,
    locales: sdk.locales.available,
    enabledLocales,
    changeLocaleVisibility,
  };
};

export default useLocales;
