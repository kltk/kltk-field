import { extend } from 'kltk-observable/dist/extend';
import React from 'react';
import { GroupContext } from '../Group/types';
import { NamePath } from '../types';
import { FieldContext, FieldMeta } from './types';

export function createFieldContext<T extends {}>(
  context: GroupContext<T>,
  key: symbol,
  path: NamePath,
): FieldContext {
  const fieldContext = {} as FieldContext;
  return extend(fieldContext, context, {
    hasValue() {
      return context.hasFieldValue(path);
    },
    getValue<Value>() {
      return context.getFieldValue<Value>(path);
    },
    setValue<Value>(value: Value) {
      return context.setFieldValue(path, value);
    },

    getMeta() {
      return context.getFieldsMeta([key])[0];
    },
    updateMeta(changed: Partial<FieldMeta>) {
      const meta = fieldContext.getMeta();
      context.setFieldMeta(key, { ...meta, ...changed, key });
    },
  });
}

export function useFieldContext<T>(context: GroupContext<T>, path: NamePath) {
  const [key] = React.useState(() => Symbol());
  React.useEffect(() => context.registerField(key), [context, key]);

  return React.useMemo(
    () => createFieldContext(context, key, path),
    [context, path, key],
  );
}
