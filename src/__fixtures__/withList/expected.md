Hello Andreas

# This is a header

```typescript
import { IncludeOptions, transform } from './transform';

const plugin = (options: IncludeOptions) => {
  return transform(options);
};

export = plugin;

```

Another paragraph

Furthermore, any service invocation can be mapped to a group identifier, so that invocations belonging to the same group can be summarized:

*   the total invocation count
*   the count of currently active invocations
*   the count of failed invocations
*   the count of succeeded invocations
*   the minimal, maximal and average execution time of both succeeded and failed invocations
