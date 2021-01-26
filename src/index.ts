import { IncludeOptions, transform } from './transform';

const plugin = (options: IncludeOptions) => {
  return transform(options);
};

export = plugin;
