import { IncludeOptions, transform } from './transform';

const attacher = (options: IncludeOptions) => {
  return transform(options);
};

export default attacher;
