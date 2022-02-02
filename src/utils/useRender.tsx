import { FieldProps } from '../Field/Field';
import { FieldContext } from '../Field/types';
import { defaultRender } from './defaultRender';
import { getOnlyChild } from './getOnlyChild';
import { useSelector } from './useSelector';

export function useRender<Value>(
  context: FieldContext,
  props: FieldProps<Value>,
) {
  const { dependencies = [], children, ...rest } = props;
  const { sym, errors } = useSelector(context, () => context.getMeta() || {});
  const value = useSelector(context, () => context.getValue());
  const control = getOnlyChild(children);

  const { disabled } = useSelector(context, (root) => root.options || {});

  useSelector(context, () =>
    dependencies.map((path) => context.getFieldValue(path)),
  );

  const data = { sym, value, disabled, errors, control, ...rest };
  const render = children instanceof Function ? children : defaultRender;
  return render(context, data) as React.ReactElement;
}
