Hello Andreas

# This is a header

```typescript
// Take a string and extract a simple named parameter
export function extractParam(name: string, input: string): OptionString {
  const regExp = /([a-z]+)=\"([^\"]+)\"/g

  var result = undefined
  var elem;
  while ((result == undefined) && (elem = regExp.exec(input)) !== null) {
    if (elem[1] == name) result = elem[2]
  }

  return result;
}
```

Another paragraph
