import { useDebounce } from "@uidotdev/usehooks";
import { useState, useEffect } from "react";
import { useCMA } from '@contentful/react-apps-toolkit';
import { TextInput } from "@contentful/f36-components";
import { AssetProps } from 'contentful-management/dist/typings/entities/asset'

interface AssetFieldTextProps {
  asset: AssetProps;
  field: string;
  locale: string;
}

export const AssetFieldText = ({
  asset: initialAsset,
  field,
  locale,
}: AssetFieldTextProps) => {
  const cma = useCMA();
  const [asset, setAsset] = useState<AssetProps>(initialAsset);
  const [newFieldValue, setNewFieldValue] = useState(asset.fields[field]?.[locale] ??  asset.fields.file?.[locale][field] ?? '');
  const debouncedFieldValue = useDebounce(newFieldValue, 300);

  useEffect(() => {
    if (field === 'fileName' && asset.fields.file?.[locale][field] !== newFieldValue) {
      cma.asset
        .update({
          assetId: asset.sys.id
        },
        {
          ...asset,
          fields: {
            ...asset.fields,
            file: {
              [locale]: {
                ...asset.fields.file[locale],
                [field]: debouncedFieldValue
              },
            },
          },
        })
        .then((result) => setAsset(result));
      return;
    }
    if (field !== 'fileName' && asset.fields[field]?.[locale] !== newFieldValue) {
      cma.asset
        .update({
          assetId: asset.sys.id
        },
        {
          ...asset,
          fields: {
            ...asset.fields,
            [field]: {
              [locale]: debouncedFieldValue,
            },
          },
        })
        .then((result) => setAsset(result));
    }
  }, [debouncedFieldValue]);

  return (
    <TextInput value={newFieldValue} onChange={(event) => setNewFieldValue(event.target.value)} />
  );
};
