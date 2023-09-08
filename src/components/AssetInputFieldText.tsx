import { useDebounce } from '@uidotdev/usehooks';
import { useState, useEffect } from 'react';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import { PageAppSDK } from '@contentful/app-sdk';
import {
  TextInput,
  Textarea,
  FormControl,
  Caption,
} from '@contentful/f36-components';
import { AssetProps } from 'contentful-management/dist/typings/entities/asset';
import { extractContentfulFieldError } from './utils/entries.ts';
import useLocales from './hooks/useLocales.tsx';
import useAssetEntries from './hooks/useAssetEntries.tsx';

interface AssetInputFieldTextComponentProps {
  asset: AssetProps;
  field: string;
  locale: string;
  rows?: number;
  as?: 'TextInput' | 'Textarea';
  showLocaleLabel?: boolean;
}

const AssetInputFieldTextComponent = ({
  asset,
  field,
  locale,
  as = 'TextInput',
  rows = 1,
  showLocaleLabel = false,
}: AssetInputFieldTextComponentProps) => {
  const initialValue =
    asset.fields[field]?.[locale] ?? asset.fields.file?.[locale]?.[field] ?? '';
  const { updateAssetEntry } = useAssetEntries();
  const [newFieldValue, setNewFieldValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const debouncedFieldValue = useDebounce(newFieldValue, 300);
  const cma = useCMA();

  useEffect(() => {
    async function fetchData() {
      if (initialValue === debouncedFieldValue) {
        return;
      }

      const fileNameEntry = {
        ...asset,
        fields: {
          ...asset.fields,
          file: {
            [locale]: {
              ...asset.fields.file[locale],
              [field]: debouncedFieldValue,
            },
          },
        },
      };
      const fieldEntry = {
        ...asset,
        fields: {
          ...asset.fields,
          [field]: {
            [locale]: debouncedFieldValue,
          },
        },
      };
      const rawData = field === 'fileName' ? fileNameEntry : fieldEntry;
      const assetId = {
        assetId: asset.sys.id,
      };

      try {
        const result = await cma.asset.update(assetId, rawData);
        updateAssetEntry(result);
      } catch (error) {
        setError(extractContentfulFieldError(error));
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFieldValue]);

  const { localeNames } = useLocales();

  const InputComponent = as === 'Textarea' ? Textarea : TextInput;

  return (
    <>
      {showLocaleLabel && <Caption>{localeNames[locale]}</Caption>}
      <InputComponent
        value={newFieldValue}
        onChange={(event) => setNewFieldValue(event.target.value)}
        rows={rows}
      />
      {error && (
        <FormControl.ValidationMessage>{error}</FormControl.ValidationMessage>
      )}
    </>
  );
};

type AssetFieldTextProps = Omit<AssetInputFieldTextComponentProps, 'locale'> & {
  locales?: string[];
};

export const AssetInputFieldText = ({
  asset,
  field,
  locales: localesProp,
  ...rest
}: AssetFieldTextProps) => {
  const sdk = useSDK<PageAppSDK>();
  const locales = localesProp ?? [sdk.locales.default];
  return locales.map((locale) => {
    return (
      <FormControl key={locale}>
        <AssetInputFieldTextComponent
          field={field}
          asset={asset}
          {...rest}
          locale={locale}
          showLocaleLabel={locales.length > 1}
        />
      </FormControl>
    );
  });
};
