import { extend } from 'kltk-observable/dist/extend';
import React from 'react';
import { GroupContext } from '../Group/types';
import { FieldContext, FieldMeta, FieldPath } from './types';

export function createFieldContext<T extends {}>(
  context: GroupContext<T>,
  key: symbol,
  path: FieldPath,
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
      return context.getField(key)!;
    },
    updateMeta(changed: Partial<FieldMeta>) {
      return context.updateField(key, changed);
    },
  });
}

export function useFieldContext<T>(context: GroupContext<T>, path: FieldPath) {
  const [key] = React.useState(() => Symbol());
  React.useEffect(() => context.registerField({ key }), [context, key]);

  return React.useMemo(
    () => createFieldContext(context, key, path),
    [context, path, key],
  );
}
